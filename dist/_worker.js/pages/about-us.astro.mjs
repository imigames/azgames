globalThis.process ??= {}; globalThis.process.env ??= {};
import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, u as unescapeHTML, l as Fragment } from '../chunks/astro/server_jqlxmikg.mjs';
import { $ as $$LegalPage } from '../chunks/LegalPage_nQPxQm9F.mjs';
import { $ as $$MainLayout } from '../chunks/MainLayout_UmvZxwvK.mjs';
import { s as sanitizeSiteContentHtml } from '../chunks/html-sanitize_DC9IPhPx.mjs';
import { g as getPublicSettings } from '../chunks/settings_CPS68JRK.mjs';
export { renderers } from '../renderers.mjs';

const $$AboutUs = createComponent(async ($$result, $$props, $$slots) => {
  const settings = await getPublicSettings();
  const customContent = settings.aboutPageContent.trim() ? sanitizeSiteContentHtml(settings.aboutPageContent) : "";
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "About us | Free Game Zone", "description": "Learn about Free Game Zone, a browser games website built for fast, free, and easy play.", "canonicalPath": "/about-us" }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "LegalPage", $$LegalPage, { "title": "About us" }, { "default": async ($$result3) => renderTemplate`${customContent ? renderTemplate`${maybeRenderHead()}<div class="game-article-content">${unescapeHTML(customContent)}</div>` : renderTemplate`${renderComponent($$result3, "Fragment", Fragment, {}, { "default": async ($$result4) => renderTemplate` <section> <h2>About Free Game Zone</h2> <p>Free Game Zone is a browser games website available at freegamezone.io. It is made for quick play, simple browsing, and easy discovery, with organized pages for arcade, action, puzzle, car, sports, clicker, casual, and io games.</p> <p>Many games on the site may be created by third-party developers or supplied through external providers. We do not claim ownership of third-party games, artwork, characters, trademarks, embedded content, or related materials.</p> </section> <section> <h2>What we offer</h2> <p>We offer categorized game listings, searchable game pages, favorites, likes, and simple information that helps players understand what a game is before they start. Our pages are designed to work across common desktop and mobile browsers with a compact arcade-style layout.</p> </section> <section> <h2>Why players use our website</h2> <p>Players use Free Game Zone because the layout is compact, visual, and easy to scan. The website is built around direct access, clear categories, and a familiar arcade-style experience where players can move from one title to another with little friction.</p> </section> <section> <h2>Our goal</h2> <p>Our goal is to maintain a useful browser game library that is simple for players and respectful toward creators, publishers, and content providers. We regularly improve organization, performance, and moderation tools as freegamezone.io grows.</p> </section> <section> <h2>Contact information note</h2> <p>For questions, feedback, copyright concerns, or game removal requests, please use the <a href="/contact-us">Contact us</a> page and include the page URL or game title involved.</p> </section> ` })}`}` })} ` })}`;
}, "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/pages/about-us.astro", void 0);

const $$file = "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/pages/about-us.astro";
const $$url = "/about-us";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$AboutUs,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
