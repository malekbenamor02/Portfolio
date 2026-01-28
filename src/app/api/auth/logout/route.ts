import { NextResponse } from 'next/server';
import { getRefreshToken, clearAuthCookies } from '@/lib/auth/cookies';
import { getSupabaseAdmin } from '@/lib/db/supabase-admin';
import crypto from 'crypto';

export async function POST() {
  try {
    const refreshToken = await getRefreshToken();

    if (refreshToken) {
      // Hash the refresh token to find the session
      const refreshTokenHash = crypto
        .createHash('sha256')
        .update(refreshToken)
        .digest('hex');
      
      const supabase = getSupabaseAdmin();
      
      // Revoke the session
      await supabase
        .from('sessions')
        .update({ revoked_at: new Date().toISOString() })
        .eq('refresh_token_hash', refreshTokenHash);
    }

    // Clear cookies
    await clearAuthCookies();

    return NextResponse.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    // Still clear cookies even if DB update fails
    await clearAuthCookies();
    return NextResponse.json({ message: 'Logged out' });
  }
}
