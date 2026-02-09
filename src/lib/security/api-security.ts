import { NextResponse } from 'next/server';

/**
 * Return a safe error message to the client (no stack traces or internal details in production)
 */
export function safeErrorMessage(error: unknown, fallback = 'Something went wrong.'): string {
  if (process.env.NODE_ENV !== 'production') {
    return error instanceof Error ? error.message : String(error);
  }
  // In production, only expose generic or intended messages
  if (error instanceof Error) {
    const msg = error.message;
    if (msg.startsWith('Unauthorized') || msg.includes('Invalid') || msg.includes('Too many')) {
      return msg;
    }
  }
  return fallback;
}

/**
 * JSON error response that doesn't leak internal details in production
 */
export function safeErrorResponse(
  error: unknown,
  status: number = 500,
  fallbackMessage = 'Something went wrong. Please try again later.'
): NextResponse {
  const message = safeErrorMessage(error, fallbackMessage);
  if (process.env.NODE_ENV !== 'production' && error instanceof Error) {
    console.error('[API Error]', error.message, error.stack);
  }
  return NextResponse.json({ error: message }, { status });
}

/**
 * Ensure request has JSON body (Content-Type) before parsing - helps avoid abuse with huge non-JSON payloads
 */
export function expectsJson(request: Request): boolean {
  const contentType = request.headers.get('content-type') ?? '';
  return contentType.includes('application/json');
}
