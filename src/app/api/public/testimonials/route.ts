import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/db/supabase-admin';

export async function GET() {
  try {
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
