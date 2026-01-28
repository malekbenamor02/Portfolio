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

    const mappedExperience = (experience || []).map((e) => {
      const row = e as Record<string, unknown>;
      return {
        id: String(row.id ?? ''),
        company: String(row.company ?? ''),
        role: String(row.role ?? ''),
        duration: String(row.duration ?? ''),
        location: String(row.location ?? ''),
        description: String(row.description ?? ''),
        achievements: Array.isArray(row.achievements) ? (row.achievements as string[]) : [],
        technologies: Array.isArray(row.technologies) ? (row.technologies as string[]) : [],
        logo: typeof row.logo === 'string' ? row.logo : undefined,
        type: typeof row.type === 'string' ? row.type : undefined,
      };
    });

    return NextResponse.json({ experience: mappedExperience });
  } catch (error) {
    console.error('Experience API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
