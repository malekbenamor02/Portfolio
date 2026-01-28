import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/require-admin';
import { getSupabaseAdmin } from '@/lib/db/supabase-admin';

export async function GET() {
  try {
    await requireAdmin();
    const supabase = getSupabaseAdmin();

    // Get total visitors
    const { count: totalVisitors } = await supabase
      .from('visitors')
      .select('*', { count: 'exact', head: true });

    // Get unique visitors today
    const today = new Date().toISOString().split('T')[0];
    const { data: todayUnique } = await supabase
      .from('unique_visitors')
      .select('count')
      .eq('date', today)
      .single();

    // Get unique visitors this week
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const { data: weekUnique } = await supabase
      .from('unique_visitors')
      .select('count')
      .gte('date', weekAgo.toISOString().split('T')[0]);

    // Get unique visitors this month
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    const { data: monthUnique } = await supabase
      .from('unique_visitors')
      .select('count')
      .gte('date', monthAgo.toISOString().split('T')[0]);

    // Get popular pages
    const { data: popularPages } = await supabase
      .from('visitors')
      .select('page_path')
      .gte('visited_at', monthAgo.toISOString());

    // Count page views
    const pageViews: Record<string, number> = {};
    popularPages?.forEach((v) => {
      pageViews[v.page_path] = (pageViews[v.page_path] || 0) + 1;
    });

    const topPages = Object.entries(pageViews)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([path, count]) => ({ path, count }));

    return NextResponse.json({
      totalVisitors: totalVisitors || 0,
      uniqueVisitors: {
        today: todayUnique?.count || 0,
        week: weekUnique?.reduce((sum, d) => sum + (d.count || 0), 0) || 0,
        month: monthUnique?.reduce((sum, d) => sum + (d.count || 0), 0) || 0,
      },
      topPages,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unauthorized';
    return NextResponse.json(
      { error: message },
      { status: message.includes('Unauthorized') ? 401 : 500 }
    );
  }
}
