import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/db/supabase-admin';
import { rateLimit, getClientIP } from '@/lib/security/rate-limit';

export async function GET(request: NextRequest) {
  try {
    const ip = getClientIP(request);
    if (!rateLimit(`public-get:visitors:${ip}`, 60, 60 * 1000)) {
      return NextResponse.json({ totalVisitors: 0 });
    }
    let supabase;
    try {
      supabase = getSupabaseAdmin();
    } catch {
      // If Supabase isn't configured, return 0 visitors instead of error
      // This allows the site to work even if database isn't set up yet
      console.warn('Supabase not configured, returning 0 visitors');
      return NextResponse.json({ totalVisitors: 0 });
    }

    const { count: totalVisitors, error } = await supabase
      .from('visitors')
      .select('*', { count: 'exact', head: true });

    if (error) {
      // If table doesn't exist, return 0 instead of error
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
        console.warn('Visitors table does not exist yet');
        return NextResponse.json({ totalVisitors: 0 });
      }
      console.error('Visitors count error:', error);
      return NextResponse.json({ totalVisitors: 0 }); // Return 0 instead of error
    }

    return NextResponse.json({ totalVisitors: totalVisitors || 0 });
  } catch (error) {
    console.error('Visitors count API error:', error);
    // Always return 0 instead of error to not break the site
    return NextResponse.json({ totalVisitors: 0 });
  }
}

