import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/db/supabase-admin';
import { rateLimit, getClientIP } from '@/lib/security/rate-limit';
import { safeErrorResponse } from '@/lib/security/api-security';
import { z } from 'zod';

const subscribeSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 5 subscriptions per hour per IP
    const ip = getClientIP(request);
    if (!rateLimit(`newsletter:${ip}`, 5, 60 * 60 * 1000)) {
      return NextResponse.json(
        { error: 'Too many subscription attempts. Please try again later.' },
        { status: 429 }
      );
    }
    if (!request.headers.get('content-type')?.includes('application/json')) {
      return NextResponse.json({ error: 'Content-Type must be application/json' }, { status: 415 });
    }
    const body = await request.json();
    const { email, name } = subscribeSchema.parse(body);

    const supabase = getSupabaseAdmin();

    // Check if already subscribed
    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('id, is_active')
      .eq('email', email.toLowerCase())
      .single();

    if (existing) {
      if (existing.is_active) {
        return NextResponse.json(
          { error: 'This email is already subscribed.' },
          { status: 400 }
        );
      } else {
        // Reactivate subscription
        await supabase
          .from('newsletter_subscribers')
          .update({
            is_active: true,
            subscribed_at: new Date().toISOString(),
            unsubscribed_at: null,
            name: name || null,
          })
          .eq('id', existing.id);

        return NextResponse.json({
          message: 'Subscription reactivated!',
        });
      }
    }

    // Create new subscription
    const userAgent = request.headers.get('user-agent') || '';
    const metadata = {
      ip: ip,
      userAgent,
      source: 'website',
    };

    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email: email.toLowerCase(),
        name: name || null,
        is_active: true,
        source: 'website',
        metadata,
      });

    if (error) {
      console.error('Newsletter subscription error:', error);
      return NextResponse.json(
        { error: 'Failed to subscribe. Please try again later.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Successfully subscribed!',
    });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid email address.' },
        { status: 400 }
      );
    }
    return safeErrorResponse(error, 500, 'Failed to subscribe. Please try again later.');
  }
}
