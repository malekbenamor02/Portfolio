import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/db/supabase-admin';
import { verifyPassword } from '@/lib/auth/passwords';
import { signAccessToken, signRefreshToken } from '@/lib/auth/jwt';
import { setAccessToken, setRefreshToken } from '@/lib/auth/cookies';
import { rateLimit, getClientIP } from '@/lib/security/rate-limit';
import { z } from 'zod';
import crypto from 'crypto';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 5 attempts per 15 minutes per IP
    const ip = getClientIP(request);
    if (!rateLimit(`login:${ip}`, 5, 15 * 60 * 1000)) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    let supabase;
    try {
      supabase = getSupabaseAdmin();
    } catch (supabaseError: unknown) {
      const message = supabaseError instanceof Error ? supabaseError.message : 'Database configuration error';
      console.error('Supabase initialization error:', message);
      return NextResponse.json(
        { error: 'Database not configured. Please check environment variables.' },
        { status: 500 }
      );
    }
    
    // Get user from database
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, password_hash, role, name, is_active')
      .eq('email', email.toLowerCase())
      .single();

    if (userError) {
      // Check if it's a table doesn't exist error
      if (userError.code === '42P01' || userError.message?.includes('does not exist')) {
        console.error('Users table does not exist. Please run the database schema.');
        return NextResponse.json(
          { error: 'Database not set up. Please run the database schema first.' },
          { status: 500 }
        );
      }
      console.error('Database query error:', userError);
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    if (!user.is_active) {
      return NextResponse.json(
        { error: 'Account is inactive' },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate tokens
    const accessToken = signAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const sessionId = crypto.randomUUID();
    const refreshToken = signRefreshToken({
      userId: user.id,
      sessionId,
    });

    // Hash refresh token using SHA256 for deterministic lookup
    const refreshTokenHash = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    // Store session in database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    const { error: sessionError } = await supabase
      .from('sessions')
      .insert({
        user_id: user.id,
        refresh_token_hash: refreshTokenHash,
        expires_at: expiresAt.toISOString(),
        ip_address: ip,
        user_agent: request.headers.get('user-agent') || '',
      });

    if (sessionError) {
      console.error('Session creation error:', sessionError);
      return NextResponse.json(
        { error: 'Failed to create session' },
        { status: 500 }
      );
    }

    // Set cookies
    await setAccessToken(accessToken);
    await setRefreshToken(refreshToken);

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
