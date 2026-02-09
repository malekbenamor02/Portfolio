import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/db/supabase-admin';
import { rateLimit, getClientIP } from '@/lib/security/rate-limit';
import { safeErrorResponse } from '@/lib/security/api-security';

const BUCKET = 'portfolio-files';
const FOLDER = 'testimonials';
const MAX_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request);
    if (!rateLimit(`upload-testimonial:${ip}`, 5, 60 * 60 * 1000)) {
      return NextResponse.json(
        { error: 'Too many uploads. Please try again later.' },
        { status: 429 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: 'No image file provided.' },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Use JPEG, PNG, WebP or GIF.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'Image must be 2MB or smaller.' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const path = `${FOLDER}/${Date.now()}-${safeName}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    let result = await supabase.storage
      .from(BUCKET)
      .upload(path, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (result.error) {
      const isBucketMissing =
        result.error.message?.includes('Bucket') ||
        result.error.message?.includes('not found') ||
        result.error.message?.toLowerCase().includes('bucket');
      if (isBucketMissing) {
        const { error: createErr } = await supabase.storage.createBucket(BUCKET, {
          public: true,
          fileSizeLimit: '2MB',
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        });
        if (!createErr) {
          result = await supabase.storage.from(BUCKET).upload(path, buffer, {
            contentType: file.type,
            upsert: false,
          });
        }
      }
    }

    if (result.error || !result.data) {
      console.error('Testimonial upload error:', result.error);
      return NextResponse.json(
        { error: 'Upload failed. Create a public Storage bucket named "portfolio-files" in Supabase Dashboard → Storage.' },
        { status: 500 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '') || '';
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${result.data.path}`;

    return NextResponse.json({ url: publicUrl });
  } catch (e) {
    return safeErrorResponse(e, 500, 'Something went wrong. Please try again.');
  }
}
