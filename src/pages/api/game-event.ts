import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../lib/supabase';

export const prerender = false;

const allowedEventTypes = new Set(['view', 'play', 'like', 'favorite', 'report']);
const MAX_BODY_BYTES = 1_024;
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

const parsePayload = async (request: Request) => {
  const contentType = request.headers.get('content-type') ?? '';

  if (!contentType.includes('application/json') && !contentType.includes('text/plain')) {
    throw new Error('Unsupported content type.');
  }

  const text = await request.text();

  if (text.length > MAX_BODY_BYTES) {
    throw new Error('Payload is too large.');
  }

  return text ? JSON.parse(text) : {};
};

export const POST: APIRoute = async ({ request }) => {
  if (!supabaseAdmin) {
    return jsonResponse({ error: 'Supabase admin client is not configured.' }, 503);
  }

  // This lightweight endpoint is safe to fail silently client-side; add Cloudflare WAF/rate limits before launch.
  if (isOversizedRequest(request)) {
    return jsonResponse({ error: 'Payload is too large.' }, 413);
  }

  let body: { gameSlug?: string; eventType?: string };

  try {
    body = await parsePayload(request);
  } catch (error) {
    const message = error instanceof Error && error.message === 'Payload is too large.'
      ? 'Payload is too large.'
      : 'Invalid JSON payload.';
    return jsonResponse({ error: message }, message === 'Payload is too large.' ? 413 : 400);
  }

  const gameSlug = String(body.gameSlug ?? '').trim();
  const eventType = String(body.eventType ?? '').trim();

  if (!slugPattern.test(gameSlug) || gameSlug.length > 120 || !allowedEventTypes.has(eventType)) {
    return jsonResponse({ error: 'Valid gameSlug and eventType are required.' }, 400);
  }

  const { data: game, error: gameError } = await supabaseAdmin
    .from('games')
    .select('id,slug,plays')
    .eq('slug', gameSlug)
    .eq('is_active', true)
    .maybeSingle();

  if (gameError) {
    return jsonResponse({ error: gameError.message }, 500);
  }

  if (!game) {
    return jsonResponse({ error: 'Game not found.' }, 404);
  }

  const { error: eventError } = await supabaseAdmin.from('game_events').insert({
    game_id: game.id,
    game_slug: game.slug,
    event_type: eventType,
  });

  if (eventError) {
    return jsonResponse({ error: eventError.message }, 500);
  }

  if (eventType === 'play') {
    const plays = typeof game.plays === 'number' ? game.plays : Number.parseInt(String(game.plays ?? '0'), 10);
    const { error: playsError } = await supabaseAdmin
      .from('games')
      .update({ plays: (Number.isNaN(plays) ? 0 : plays) + 1, updated_at: new Date().toISOString() })
      .eq('id', game.id);

    if (playsError) {
      return jsonResponse({ error: playsError.message }, 500);
    }
  }

  return jsonResponse({ success: true }, 201);
};
