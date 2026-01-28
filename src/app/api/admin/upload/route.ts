import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/require-admin';
import { z } from 'zod';

const uploadSchema = z.object({
  fileName: z.string(),
  fileType: z.string(),
  fileSize: z.number(),
  base64: z.string(),
  folder: z.enum(['projects', 'experience', 'testimonials', 'blog']),
});

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const { fileName, fileType, fileSize, folder } = uploadSchema.parse(body);

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (fileSize > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
    if (!allowedTypes.includes(fileType)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only images and PDFs are allowed.' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueFileName = `${folder}/${timestamp}-${sanitizedFileName}`;

    // TODO: Implement actual file upload to Supabase Storage
    // For now, return placeholder URL
    // const buffer = Buffer.from(base64, 'base64');
    // const supabase = getSupabaseAdmin();

    // Upload to Supabase Storage (if you have storage bucket set up)
    // For now, we'll store the file URL in the database
    // You'll need to set up Supabase Storage bucket first
    
    // This is a placeholder - you'll need to implement actual file storage
    // For Supabase Storage:
    // const { data, error } = await supabase.storage
    //   .from('portfolio-files')
    //   .upload(uniqueFileName, buffer, {
    //     contentType: fileType,
    //   });

    // For now, return a placeholder URL
    // In production, replace this with actual Supabase Storage URL
    const fileUrl = `/uploads/${uniqueFileName}`;

    return NextResponse.json({
      url: fileUrl,
      fileName: uniqueFileName,
      size: fileSize,
      type: fileType,
    });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
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
