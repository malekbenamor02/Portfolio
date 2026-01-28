import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/db/supabase-admin';

export async function GET() {
  try {
    let supabase;
    try {
      supabase = getSupabaseAdmin();
    } catch {
      // If Supabase isn't configured, return empty array
      console.warn('Supabase not configured, returning empty experience');
      return NextResponse.json({ experience: [] });
    }
    
    const { data: experience, error } = await supabase
      .from('experience')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      // If table doesn't exist, return empty array
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
        console.warn('Experience table does not exist yet');
        return NextResponse.json({ experience: [] });
      }
      console.error('Error fetching experience:', error);
      return NextResponse.json({ experience: [] }); // Return empty instead of error
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
