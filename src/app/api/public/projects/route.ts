import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/db/supabase-admin';

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error fetching projects:', error);
      return NextResponse.json(
        { error: 'Failed to fetch projects' },
        { status: 500 }
      );
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
    console.error('Projects API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
