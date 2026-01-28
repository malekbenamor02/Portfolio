import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/require-admin';
import { getSupabaseAdmin } from '@/lib/db/supabase-admin';
import { z } from 'zod';

const experienceSchema = z.object({
  company: z.string().min(1).optional(),
  role: z.string().min(1).optional(),
  duration: z.string().min(1).optional(),
  location: z.string().optional(),
  description: z.string().min(1).optional(),
  achievements: z.array(z.string()).optional(),
  technologies: z.array(z.string()).optional(),
  type: z.enum(['internship', 'part-time', 'full-time', 'freelance']).optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  current: z.boolean().optional(),
  order_index: z.number().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const supabase = getSupabaseAdmin();
    
    const { data: exp, error } = await supabase
      .from('experience')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !exp) {
      return NextResponse.json(
        { error: 'Experience not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ experience: exp });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unauthorized';
    return NextResponse.json(
      { error: message },
      { status: message.includes('Unauthorized') ? 401 : 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const data = experienceSchema.parse(body);

    const supabase = getSupabaseAdmin();
    
    const { data: exp, error } = await supabase
      .from('experience')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update experience' },
        { status: 500 }
      );
    }

    return NextResponse.json({ experience: exp });
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const supabase = getSupabaseAdmin();
    
    const { error } = await supabase
      .from('experience')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete experience' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Experience deleted successfully' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unauthorized';
    return NextResponse.json(
      { error: message },
      { status: message.includes('Unauthorized') ? 401 : 500 }
    );
  }
}
