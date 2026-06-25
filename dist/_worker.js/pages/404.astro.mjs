globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_jqlxmikg.mjs';
import { $ as $$MainLayout } from '../chunks/MainLayout_UmvZxwvK.mjs';
/* empty css                               */
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://freegamezone.io");
const $$404 = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$404;
  Astro2.response.status = 404;
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "404 - Page not found", "description": "The page you are looking for could not be found.", "canonicalPath": Astro2.url.pathname, "robots": "noindex, follow", "data-astro-cid-zetdm5md": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="not-found-page poki-not-found" aria-labelledby="not-found-title" data-astro-cid-zetdm5md> <div class="not-found-card" data-astro-cid-zetdm5md> <h1 id="not-found-title" data-astro-cid-zetdm5md>404 - Page not found</h1> <p data-astro-cid-zetdm5md>The page you are looking for could not be found.</p> <a href="/" data-astro-cid-zetdm5md>Back to homepage</a> </div> </section> ` })} `;
}, "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/pages/404.astro", void 0);

const $$file = "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/pages/404.astro";
const $$url = "/404";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$404,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
