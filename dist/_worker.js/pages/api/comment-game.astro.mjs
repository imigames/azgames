globalThis.process ??= {}; globalThis.process.env ??= {};
import { d as createGameComment } from '../../chunks/comments_DOZvQxwy.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const MAX_BODY_BYTES = 6144;
const jsonResponse = (payload, status) => new Response(JSON.stringify(payload), {
  status,
  headers: { "content-type": "application/json" }
});
const isOversizedRequest = (request) => {
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  return Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES;
};
const POST = async ({ request }) => {
  if (isOversizedRequest(request)) {
    return jsonResponse({ ok: false, message: "Payload is too large." }, 400);
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ ok: false, message: "Invalid JSON payload." }, 400);
  }
  if (String(body.website ?? "").trim()) {
    return jsonResponse(
      { ok: true, message: "Thanks! Your comment is waiting for approval." },
      200
    );
  }
  try {
    const result = await createGameComment({
      gameSlug: String(body.gameSlug ?? ""),
      name: String(body.name ?? ""),
      email: String(body.email ?? ""),
      comment: String(body.comment ?? ""),
      request
    });
    if (!result.success) {
      const isValidationError = result.error !== "Supabase admin client is not configured.";
      return jsonResponse(
        { ok: false, message: result.error ?? "Unable to save comment." },
        isValidationError ? 400 : 500
      );
    }
    return jsonResponse(
      { ok: true, message: "Thanks! Your comment is waiting for approval." },
      201
    );
  } catch {
    return jsonResponse({ ok: false, message: "Unable to save comment." }, 500);
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
