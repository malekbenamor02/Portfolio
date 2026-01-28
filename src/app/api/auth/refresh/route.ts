import { NextResponse } from 'next/server';
import { getRefreshToken, setAccessToken } from '@/lib/auth/cookies';
import { signAccessToken } from '@/lib/auth/jwt';
import { getSupabaseAdmin } from '@/lib/db/supabase-admin';
import jwt from 'jsonwebtoken';

export async function POST() {
  try {
    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'No refresh token' },
        { status: 401 }
      );
    }

    // Verify refresh token (has sessionId in payload)
    let decoded: { userId: string; sessionId: string };
    try {
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
      }

      decoded = jwt.verify(refreshToken, secret) as { userId: string; sessionId: string };
    } catch {
      return NextResponse.json(
        { error: 'Invalid refresh token' },
        { status: 401 }
      );
    }

    // Hash refresh token using SHA256 for deterministic lookup
    const crypto = await import('crypto');
    const refreshTokenHash = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');
    const supabase = getSupabaseAdmin();

    // Check if session exists and is valid
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .select('*')
      .eq('refresh_token_hash', refreshTokenHash)
      .is('revoked_at', null)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Invalid or expired session' },
        { status: 401 }
      );
    }

    // Get user
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, role, is_active')
      .eq('id', decoded.userId)
      .single();

    if (userError || !user || !user.is_active) {
      return NextResponse.json(
        { error: 'User not found or inactive' },
        { status: 401 }
      );
    }

    // Generate new access token
    const accessToken = signAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    await setAccessToken(accessToken);

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Refresh error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
