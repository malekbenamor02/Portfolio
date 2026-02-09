import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/db/supabase-admin';
import { rateLimit, getClientIP } from '@/lib/security/rate-limit';
import { safeErrorResponse } from '@/lib/security/api-security';
import { z } from 'zod';

const publicTestimonialSchema = z.object({
  name: z.string().min(1).max(200),
  role: z.string().min(1).max(200),
  company: z.string().min(1).max(200),
  content: z.string().min(10).max(2000),
  avatar_url: z.string().url().max(2000),
  rating: z.number().min(1).max(5),
});

export async function GET(request: NextRequest) {
  try {
    const ip = getClientIP(request);
    if (!rateLimit(`public-get:testimonials:${ip}`, 120, 60 * 1000)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }
    const supabase = getSupabaseAdmin();

    const { data: testimonials, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('approved', true)
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error fetching testimonials:', error);
      return NextResponse.json({ testimonials: [] });
    }

    return NextResponse.json({ testimonials: testimonials || [] });
  } catch (error) {
    console.error('Testimonials API error:', error);
    return NextResponse.json({ testimonials: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request);
    if (!rateLimit(`testimonial:${ip}`, 3, 60 * 60 * 1000)) {
      return NextResponse.json(
        { error: 'Too many submissions. Please try again later.' },
        { status: 429 }
      );
    }
    if (!request.headers.get('content-type')?.includes('application/json')) {
      return NextResponse.json({ error: 'Content-Type must be application/json' }, { status: 415 });
    }
    const body = await request.json();
    const data = publicTestimonialSchema.parse(body);

    const supabase = getSupabaseAdmin();
    const { data: testimonial, error } = await supabase
      .from('testimonials')
      .insert({
        name: data.name.trim(),
        role: data.role.trim(),
        company: data.company.trim(),
        content: data.content.trim(),
        avatar_url: data.avatar_url.trim(),
        rating: data.rating,
        approved: false,
        featured: false,
        order_index: 0,
        created_by: null,
      })
      .select()
      .single();

    if (error) {
      console.error('Public testimonial submit error:', error);
      return NextResponse.json(
        { error: 'Failed to submit. Please try again later.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Thank you! Your testimonial has been submitted for review.', testimonial },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      const first = error.issues[0];
      const msg = first ? `${first.path.join('.')}: ${first.message}` : 'Invalid data';
      return NextResponse.json({ error: msg }, { status: 400 });
    }
    return safeErrorResponse(error, 500, 'Something went wrong. Please try again.');
  }
}
