globalThis.process ??= {}; globalThis.process.env ??= {};
import { b as SITE_URL } from '../chunks/site_ByuoMtRy.mjs';
export { renderers } from '../renderers.mjs';

const prerender = false;
const GET = () => new Response(`User-agent: *
Allow: /

Sitemap: ${new URL("/sitemap.xml", SITE_URL).toString()}
`, {
  headers: {
    "content-type": "text/plain; charset=utf-8"
  }
});

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
