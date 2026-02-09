import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/require-admin';
import { getSupabaseAdmin } from '@/lib/db/supabase-admin';
import { z } from 'zod';

const testimonialSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  company: z.string().optional(),
  content: z.string().min(1),
  avatar_url: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
  featured: z.boolean().optional(),
  order_index: z.number().optional(),
  approved: z.boolean().optional(),
});

export async function GET() {
  try {
    await requireAdmin();
    const supabase = getSupabaseAdmin();

    const { data: testimonials, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      // Table may not exist yet (migration not run); return empty list so dashboard still loads
      const isMissingTable =
        error.code === '42P01' ||
        (typeof error.message === 'string' && error.message.includes('does not exist'));
      if (isMissingTable) {
        console.warn('Testimonials table missing or inaccessible. Run supabase-schema-updates.sql:', error.message);
        return NextResponse.json({ testimonials: [] });
      }
      console.error('Testimonials fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch testimonials' },
        { status: 500 }
      );
    }

    return NextResponse.json({ testimonials: testimonials || [] });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unauthorized';
    return NextResponse.json(
      { error: message },
      { status: message.includes('Unauthorized') ? 401 : 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireAdmin();
    const body = await request.json();
    const data = testimonialSchema.parse(body);

    const supabase = getSupabaseAdmin();

    const { data: testimonial, error } = await supabase
      .from('testimonials')
      .insert({
        ...data,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create testimonial' },
        { status: 500 }
      );
    }

    return NextResponse.json({ testimonial }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.issues },
        { status: 400 }
      );
    }
    const message = error instanceof Error ? error.message : 'Unauthorized';
    return NextResponse.json(
      { error: message },
      { status: message.includes('Unauthorized') ? 401 : 500 }
    );
  }
}
