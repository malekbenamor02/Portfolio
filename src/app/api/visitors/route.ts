import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/db/supabase-admin';
import { rateLimit, getClientIP } from '@/lib/security/rate-limit';
import { z } from 'zod';
import crypto from 'crypto';

const visitorSchema = z.object({
  page_path: z.string(),
  referrer: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 30 requests per minute per IP
    const ip = getClientIP(request);
    if (!rateLimit(`visitor:${ip}`, 30, 60 * 1000)) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { page_path, referrer } = visitorSchema.parse(body);

    // Create privacy-safe visitor hash (IP + User Agent)
    const userAgent = request.headers.get('user-agent') || '';
    const visitorHash = crypto
      .createHash('sha256')
      .update(`${ip}${userAgent}${process.env.VISITOR_SALT || 'default-salt'}`)
      .digest('hex');

    const supabase = getSupabaseAdmin();
    
    // Insert visitor record
    const { error } = await supabase
      .from('visitors')
      .insert({
        visitor_hash: visitorHash,
        page_path,
        referrer: referrer || null,
      });

    if (error) {
      console.error('Visitor tracking error:', error);
      // Don't fail the request if tracking fails
    }

    // Update unique visitors count for today
    const today = new Date().toISOString().split('T')[0];
    try {
      const { data: existing } = await supabase
        .from('unique_visitors')
        .select('count')
        .eq('date', today)
        .maybeSingle();

      if (existing?.count != null) {
        await supabase
          .from('unique_visitors')
          .update({ count: existing.count + 1 })
          .eq('date', today);
      } else {
        await supabase.from('unique_visitors').insert({ date: today, count: 1 });
      }
    } catch (uniqueError) {
      // Don't fail the request if unique visitor tracking fails
      console.error('Unique visitor tracking error:', uniqueError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Visitor API error:', error);
    // Always return success to not break user experience
    return NextResponse.json({ success: true });
  }
}
