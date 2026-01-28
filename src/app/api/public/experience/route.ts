import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/db/supabase-admin';

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    
    const { data: experience, error } = await supabase
      .from('experience')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error fetching experience:', error);
      return NextResponse.json(
        { error: 'Failed to fetch experience' },
        { status: 500 }
      );
    }

    return NextResponse.json({ experience: experience || [] });
  } catch (error) {
    console.error('Experience API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
