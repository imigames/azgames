globalThis.process ??= {}; globalThis.process.env ??= {};
import { b as getSecret } from '../../../chunks/supabase_C3sp2Zx_.mjs';
import { r as runCronPublishOnce } from '../../../chunks/cron-publish_CO3smaaZ.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: {
    "content-type": "application/json"
  }
});
const normalizeSecret = (value) => typeof value === "string" && value.trim().length > 0 ? value.trim() : "";
const getCronSecret = () => {
  try {
    return normalizeSecret(getSecret("CRON_SECRET"));
  } catch {
    return "";
  }
};
const getBearerToken = (request) => {
  const authorization = request.headers.get("authorization") ?? "";
  const [scheme, token] = authorization.split(/\s+/, 2);
  return scheme?.toLowerCase() === "bearer" ? normalizeSecret(token) : "";
};
const POST = async ({ request }) => {
  const cronSecret = getCronSecret();
  if (!cronSecret) {
    return json({ ok: false, message: "Cron secret is not configured." }, 500);
  }
  if (getBearerToken(request) !== cronSecret) {
    return json({ ok: false, message: "Unauthorized." }, 401);
  }
  try {
    const summary = await runCronPublishOnce({ source: "cron" });
    if (summary.error) {
      return json(
        {
          ok: false,
          message: summary.error,
          processed: summary.processed,
          published: summary.published,
          failed: summary.failed,
          skipped: summary.skipped
        },
        500
      );
    }
    const message = summary.processed === 0 && summary.message === "No inactive games to publish." ? "No inactive games available." : summary.message ?? `Processed ${summary.processed}, Published ${summary.published}, Failed ${summary.failed}, Skipped ${summary.skipped}.`;
    return json({
      ok: true,
      source: "cron",
      processed: summary.processed,
      published: summary.published,
      failed: summary.failed,
      skipped: summary.skipped,
      message
    });
  } catch {
    return json({ ok: false, message: "Unable to run Cron Publish right now." }, 500);
  }
};
const ALL = () => json({ ok: false, message: "Method not allowed." }, 405);

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  ALL,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
