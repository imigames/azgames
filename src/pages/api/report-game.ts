import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../lib/supabase';

export const prerender = false;

const MAX_BODY_BYTES = 8_192;
const MAX_DETAILS_LENGTH = 2_000;
const allowedReasons = new Set(['Game not loading', 'Wrong game', 'Inappropriate content', 'Other']);
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

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
  if (!supabaseAdmin) {
    return jsonResponse({ error: 'Supabase admin client is not configured.' }, 503);
  }

  // Keep public write endpoints bounded and pair this route with Cloudflare WAF/rate limiting in production.
  if (isOversizedRequest(request)) {
    return jsonResponse({ error: 'Payload is too large.' }, 413);
  }

  let body: { gameSlug?: string; reason?: string; details?: string };

  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON payload.' }, 400);
  }

  const gameSlug = String(body.gameSlug ?? '').trim();
  const reason = String(body.reason ?? '').trim();
  const details = String(body.details ?? '').trim();

  if (!slugPattern.test(gameSlug) || gameSlug.length > 120) {
    return jsonResponse({ error: 'A valid gameSlug is required.' }, 400);
  }

  if (!allowedReasons.has(reason)) {
    return jsonResponse({ error: 'A valid report reason is required.' }, 400);
  }

  if (details.length > MAX_DETAILS_LENGTH) {
    return jsonResponse({ error: 'Report details are too long.' }, 400);
  }

  const { data: game, error: gameError } = await supabaseAdmin
    .from('games')
    .select('id,slug')
    .eq('slug', gameSlug)
    .eq('is_active', true)
    .maybeSingle();

  if (gameError) {
    return jsonResponse({ error: gameError.message }, 500);
  }

  if (!game) {
    return jsonResponse({ error: 'Game not found.' }, 404);
  }

  const { error } = await supabaseAdmin.from('game_reports').insert({
    game_id: game.id,
    game_slug: game.slug,
    reason,
    details: details || null,
    status: 'new',
  });

  if (error) {
    return jsonResponse({ error: error.message }, 500);
  }

  return jsonResponse({ success: true }, 201);
};
