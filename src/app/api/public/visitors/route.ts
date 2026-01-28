import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/db/supabase-admin';

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();

    const { count: totalVisitors, error } = await supabase
      .from('visitors')
      .select('*', { count: 'exact', head: true });

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch visitors' }, { status: 500 });
    }

    return NextResponse.json({ totalVisitors: totalVisitors || 0 });
  } catch (error) {
    console.error('Visitors count API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

