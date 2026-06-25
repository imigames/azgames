globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createContactMessage } from '../../chunks/contact_DCDPo53Q.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const MAX_BODY_BYTES = 8192;
const jsonResponse = (payload, status) => new Response(JSON.stringify(payload), {
  status,
  headers: { "content-type": "application/json" }
});
const successPayload = { ok: true, message: "Thanks! Your message has been sent." };
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
    return jsonResponse(successPayload, 200);
  }
  try {
    const result = await createContactMessage({
      name: String(body.name ?? ""),
      email: String(body.email ?? ""),
      subject: String(body.subject ?? ""),
      message: String(body.message ?? ""),
      request
    });
    if (!result.success) {
      const status = result.error === "Unable to save message." ? 500 : 400;
      return jsonResponse({ ok: false, message: result.error ?? "Unable to save message." }, status);
    }
    return jsonResponse(successPayload, 201);
  } catch {
    return jsonResponse({ ok: false, message: "Unable to save message." }, 500);
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
