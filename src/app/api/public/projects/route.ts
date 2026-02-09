import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/db/supabase-admin';
import { rateLimit, getClientIP } from '@/lib/security/rate-limit';
import { safeErrorResponse } from '@/lib/security/api-security';

export async function GET(request: NextRequest) {
  try {
    const ip = getClientIP(request);
    if (!rateLimit(`public-get:projects:${ip}`, 120, 60 * 1000)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }
    let supabase;
    try {
      supabase = getSupabaseAdmin();
    } catch {
      // If Supabase isn't configured, return empty array
      console.warn('Supabase not configured, returning empty projects');
      return NextResponse.json({ projects: [] });
    }
    
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      // If table doesn't exist, return empty array
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
        console.warn('Projects table does not exist yet');
        return NextResponse.json({ projects: [] });
      }
      console.error('Error fetching projects:', error);
      return NextResponse.json({ projects: [] }); // Return empty instead of error
    }

    const mappedProjects = (projects || []).map((p) => {
      const row = p as Record<string, unknown>;
      return {
        id: String(row.id ?? ''),
        title: String(row.title ?? ''),
        description: String(row.description ?? ''),
        longDescription: String(row.long_description ?? row.longDescription ?? ''),
        technologies: Array.isArray(row.technologies) ? (row.technologies as string[]) : [],
        features: Array.isArray(row.features) ? (row.features as string[]) : [],
        image: String(row.image_url ?? row.image ?? ''),
        demoUrl: typeof row.demo_url === 'string' ? row.demo_url : (typeof row.demoUrl === 'string' ? row.demoUrl : undefined),
        githubUrl: typeof row.github_url === 'string' ? row.github_url : (typeof row.githubUrl === 'string' ? row.githubUrl : undefined),
        category: (typeof row.category === 'string' ? row.category : 'web') as 'web' | 'mobile' | 'blockchain' | 'ai',
      };
    });

    return NextResponse.json({ projects: mappedProjects });
  } catch (error) {
    return safeErrorResponse(error, 500);
  }
}
