globalThis.process ??= {}; globalThis.process.env ??= {};
import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, u as unescapeHTML, l as Fragment } from '../chunks/astro/server_jqlxmikg.mjs';
import { $ as $$LegalPage } from '../chunks/LegalPage_nQPxQm9F.mjs';
import { $ as $$MainLayout } from '../chunks/MainLayout_UmvZxwvK.mjs';
import { s as sanitizeSiteContentHtml } from '../chunks/html-sanitize_DC9IPhPx.mjs';
import { g as getPublicSettings } from '../chunks/settings_CPS68JRK.mjs';
export { renderers } from '../renderers.mjs';

const $$TermOfUse = createComponent(async ($$result, $$props, $$slots) => {
  const settings = await getPublicSettings();
  const customContent = settings.termsOfUseContent.trim() ? sanitizeSiteContentHtml(settings.termsOfUseContent) : "";
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Term of use | Free Game Zone", "description": "Read the Free Game Zone terms of use for freegamezone.io access, third-party content, user conduct, and disclaimers.", "canonicalPath": "/term-of-use" }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "LegalPage", $$LegalPage, { "title": "Term of use" }, { "default": async ($$result3) => renderTemplate`${customContent ? renderTemplate`${maybeRenderHead()}<div class="game-article-content">${unescapeHTML(customContent)}</div>` : renderTemplate`${renderComponent($$result3, "Fragment", Fragment, {}, { "default": async ($$result4) => renderTemplate` <section><h2>Term of use</h2><p>These terms describe the basic rules for using Free Game Zone and browsing game pages on freegamezone.io.</p></section> <section><h2>Acceptance of terms</h2><p>By using freegamezone.io, you agree to use it in a reasonable way and follow these terms. If you do not agree, you should stop using the website.</p></section> <section><h2>Use of the website</h2><p>You may use Free Game Zone for personal entertainment, game discovery, and general browsing. You should not attempt to damage the website, overload public features, bypass security, or interfere with other users.</p></section> <section><h2>Games and third-party content</h2><p>Games may be provided by third-party developers, publishers, or external providers through embedded content or links. We do not claim ownership of third-party games or related assets, and game availability may change.</p></section> <section><h2>User conduct</h2><p>Please do not submit misleading reports, abusive messages, harmful code, or content that violates the rights of others. Simple feedback and accurate issue reports are welcome.</p></section> <section><h2>Intellectual property</h2><p>The website layout, text, and organization belong to Free Game Zone unless otherwise noted. Game names, artwork, embedded content, trademarks, and other third-party materials belong to their respective owners.</p></section> <section><h2>Disclaimer</h2><p>Free Game Zone is provided as available. We try to keep pages useful and functional, but we cannot guarantee that every third-party game will always load, remain available, or work on every device.</p></section> <section><h2>Limitation of liability</h2><p>To the extent allowed by law, Free Game Zone is not responsible for problems caused by third-party game content, external providers, browser settings, or interruptions outside our control.</p></section> <section><h2>Changes to terms</h2><p>We may update these terms as the website changes. The latest version will be posted on this page.</p></section> <section><h2>Contact</h2><p>Questions about these terms, copyright issues, third-party content, or game removal requests can be sent through the <a href="/contact-us">Contact us</a> page.</p></section> ` })}`}` })} ` })}`;
}, "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/pages/term-of-use.astro", void 0);

const $$file = "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/pages/term-of-use.astro";
const $$url = "/term-of-use";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$TermOfUse,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
