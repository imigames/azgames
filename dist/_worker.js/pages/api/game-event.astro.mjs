globalThis.process ??= {}; globalThis.process.env ??= {};
import { s as supabaseAdmin } from '../../chunks/supabase_C3sp2Zx_.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const allowedEventTypes = /* @__PURE__ */ new Set(["view", "play", "like", "favorite", "report"]);
const MAX_BODY_BYTES = 1024;
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const jsonResponse = (payload, status) => new Response(JSON.stringify(payload), {
  status,
  headers: { "content-type": "application/json" }
});
const isOversizedRequest = (request) => {
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  return Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES;
};
const parsePayload = async (request) => {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json") && !contentType.includes("text/plain")) {
    throw new Error("Unsupported content type.");
  }
  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) {
    throw new Error("Payload is too large.");
  }
  return text ? JSON.parse(text) : {};
};
const POST = async ({ request }) => {
  if (!supabaseAdmin) {
    return jsonResponse({ error: "Supabase admin client is not configured." }, 503);
  }
  if (isOversizedRequest(request)) {
    return jsonResponse({ error: "Payload is too large." }, 413);
  }
  let body;
  try {
    body = await parsePayload(request);
  } catch (error) {
    const message = error instanceof Error && error.message === "Payload is too large." ? "Payload is too large." : "Invalid JSON payload.";
    return jsonResponse({ error: message }, message === "Payload is too large." ? 413 : 400);
  }
  const gameSlug = String(body.gameSlug ?? "").trim();
  const eventType = String(body.eventType ?? "").trim();
  if (!slugPattern.test(gameSlug) || gameSlug.length > 120 || !allowedEventTypes.has(eventType)) {
    return jsonResponse({ error: "Valid gameSlug and eventType are required." }, 400);
  }
  const { data: game, error: gameError } = await supabaseAdmin.from("games").select("id,slug,plays").eq("slug", gameSlug).eq("is_active", true).maybeSingle();
  if (gameError) {
    return jsonResponse({ error: gameError.message }, 500);
  }
  if (!game) {
    return jsonResponse({ error: "Game not found." }, 404);
  }
  const { error: eventError } = await supabaseAdmin.from("game_events").insert({
    game_id: game.id,
    game_slug: game.slug,
    event_type: eventType
  });
  if (eventError) {
    return jsonResponse({ error: eventError.message }, 500);
  }
  if (eventType === "play") {
    const plays = typeof game.plays === "number" ? game.plays : Number.parseInt(String(game.plays ?? "0"), 10);
    const { error: playsError } = await supabaseAdmin.from("games").update({ plays: (Number.isNaN(plays) ? 0 : plays) + 1, updated_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", game.id);
    if (playsError) {
      return jsonResponse({ error: playsError.message }, 500);
    }
  }
  return jsonResponse({ success: true }, 201);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
