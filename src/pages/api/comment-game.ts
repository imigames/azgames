import type { APIRoute } from 'astro';
import { createGameComment } from '../../lib/comments';

export const prerender = false;

const MAX_BODY_BYTES = 6_144;

const jsonResponse = (payload: unknown, status: number) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { 'content-type': 'application/json' },
  });

const isOversizedRequest = (request: Request) => {
  const contentLength = Number(request.headers.get('content-length') ?? '0');
  return Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES;
};

export const POST: APIRoute = async ({ request }) => {
  // Keep public write endpoints bounded and pair this route with Cloudflare WAF/rate limiting in production.
  if (isOversizedRequest(request)) {
    return jsonResponse({ ok: false, message: 'Payload is too large.' }, 400);
  }

  let body: {
    gameSlug?: string;
    name?: string;
    email?: string;
    comment?: string;
    website?: string;
  };

  try {
    body = await request.json();
  } catch {
    return jsonResponse({ ok: false, message: 'Invalid JSON payload.' }, 400);
  }

  if (String(body.website ?? '').trim()) {
    return jsonResponse(
      { ok: true, message: 'Thanks! Your comment is waiting for approval.' },
      200,
    );
  }

  try {
    const result = await createGameComment({
      gameSlug: String(body.gameSlug ?? ''),
      name: String(body.name ?? ''),
      email: String(body.email ?? ''),
      comment: String(body.comment ?? ''),
      request,
    });

    if (!result.success) {
      const isValidationError = result.error !== 'Supabase admin client is not configured.';
      return jsonResponse(
        { ok: false, message: result.error ?? 'Unable to save comment.' },
        isValidationError ? 400 : 500,
      );
    }

    return jsonResponse(
      { ok: true, message: 'Thanks! Your comment is waiting for approval.' },
      201,
    );
  } catch {
    return jsonResponse({ ok: false, message: 'Unable to save comment.' }, 500);
  }
};
