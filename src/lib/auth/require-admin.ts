import { getAccessToken } from './cookies';
import { verifyToken } from './jwt';
import { getSupabaseAdmin } from '../db/supabase-admin';
import type { JWTPayload } from './jwt';

export interface AdminUser {
  id: string;
  email: string;
  role: string;
  name: string | null;
}

/**
 * Require admin authentication for API routes
 * Throws error if not authenticated
 */
export async function requireAdmin(): Promise<{ user: AdminUser; token: JWTPayload }> {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    throw new Error('Unauthorized: No access token');
  }

  try {
    // Verify JWT signature and expiry
    const decoded = verifyToken(accessToken);

    // Verify user still exists and is active
    const supabase = getSupabaseAdmin();
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, role, name, is_active')
      .eq('id', decoded.userId)
      .single();

    if (error || !user || !user.is_active) {
      throw new Error('Unauthorized: User not found or inactive');
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
      token: decoded,
    };
  } catch {
    throw new Error('Unauthorized: Invalid token');
  }
}
