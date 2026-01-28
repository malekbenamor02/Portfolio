import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/require-admin';
import { getSupabaseAdmin } from '@/lib/db/supabase-admin';
import { z } from 'zod';

const experienceSchema = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  duration: z.string().min(1),
  location: z.string().optional(),
  description: z.string().min(1),
  achievements: z.array(z.string()).optional(),
  technologies: z.array(z.string()).optional(),
  type: z.enum(['internship', 'part-time', 'full-time', 'freelance']).optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  current: z.boolean().optional(),
  order_index: z.number().optional(),
});

export async function GET() {
  try {
    await requireAdmin();
    const supabase = getSupabaseAdmin();
    
    const { data: experience, error } = await supabase
      .from('experience')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch experience' },
        { status: 500 }
      );
    }

    return NextResponse.json({ experience: experience || [] });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unauthorized';
    return NextResponse.json(
      { error: message },
      { status: message.includes('Unauthorized') ? 401 : 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireAdmin();
    const body = await request.json();
    const data = experienceSchema.parse(body);

    const supabase = getSupabaseAdmin();
    
    const { data: exp, error } = await supabase
      .from('experience')
      .insert({
        ...data,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create experience' },
        { status: 500 }
      );
    }

    return NextResponse.json({ experience: exp }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.issues },
        { status: 400 }
      );
    }
    const message = error instanceof Error ? error.message : 'Unauthorized';
    return NextResponse.json(
      { error: message },
      { status: message.includes('Unauthorized') ? 401 : 500 }
    );
  }
}
