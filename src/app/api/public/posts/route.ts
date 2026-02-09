import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/db/supabase-admin';
import { rateLimit, getClientIP } from '@/lib/security/rate-limit';
import { safeErrorResponse } from '@/lib/security/api-security';

export async function GET(request: NextRequest) {
  try {
    const ip = getClientIP(request);
    if (!rateLimit(`public-get:posts:${ip}`, 120, 60 * 1000)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }
    const supabase = getSupabaseAdmin();
    
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('published_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
      return NextResponse.json(
        { error: 'Failed to fetch posts' },
        { status: 500 }
      );
    }

    return NextResponse.json({ posts: posts || [] });
  } catch (error) {
    return safeErrorResponse(error, 500);
  }
}
