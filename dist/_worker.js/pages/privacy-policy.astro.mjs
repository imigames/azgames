globalThis.process ??= {}; globalThis.process.env ??= {};
import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, u as unescapeHTML, l as Fragment } from '../chunks/astro/server_jqlxmikg.mjs';
import { $ as $$LegalPage } from '../chunks/LegalPage_nQPxQm9F.mjs';
import { $ as $$MainLayout } from '../chunks/MainLayout_UmvZxwvK.mjs';
import { s as sanitizeSiteContentHtml } from '../chunks/html-sanitize_DC9IPhPx.mjs';
import { g as getPublicSettings } from '../chunks/settings_CPS68JRK.mjs';
export { renderers } from '../renderers.mjs';

const $$PrivacyPolicy = createComponent(async ($$result, $$props, $$slots) => {
  const settings = await getPublicSettings();
  const customContent = settings.privacyPolicyContent.trim() ? sanitizeSiteContentHtml(settings.privacyPolicyContent) : "";
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Privacy policy | Free Game Zone", "description": "Read the Free Game Zone privacy policy for information about data, cookies, analytics, advertising, third-party games, and contact options.", "canonicalPath": "/privacy-policy" }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "LegalPage", $$LegalPage, { "title": "Privacy policy" }, { "default": async ($$result3) => renderTemplate`${customContent ? renderTemplate`${maybeRenderHead()}<div class="game-article-content">${unescapeHTML(customContent)}</div>` : renderTemplate`${renderComponent($$result3, "Fragment", Fragment, {}, { "default": async ($$result4) => renderTemplate` <section><h2>Privacy policy</h2><p>This policy explains how Free Game Zone handles basic information related to freegamezone.io, browser game pages, embedded content, and voluntary contact messages.</p></section> <section><h2>Information we collect</h2><p>We may collect technical information such as pages visited, browser type, approximate device details, game events, search activity, and basic form details you choose to submit. Favorites, likes, and some contact form messages may be stored locally in your browser.</p></section> <section><h2>How we use information</h2><p>We use information to improve navigation, understand which games are useful to players, fix loading issues, respond to messages, measure general performance, and keep the website safe from abuse.</p></section> <section><h2>Cookies and similar technologies</h2><p>freegamezone.io may use local storage, cookies, or similar browser technologies for preferences, favorites, likes, analytics, advertising, fraud prevention, and basic site operation.</p></section> <section><h2>Third-party games and external content</h2><p>Games may be created by third-party developers or loaded from external providers through embedded frames or external content. When a game or embedded frame loads, the provider may process information under its own policies.</p></section> <section><h2>Advertising</h2><p>If advertising is added, advertising partners may use cookies, device information, or similar technologies to measure ad performance, limit repeated ads, provide relevant ads, and prevent fraud.</p></section> <section><h2>Data retention</h2><p>We keep website records only as long as reasonably needed for operation, support, moderation, analytics, or legal requests. Browser local storage can be cleared by the user at any time.</p></section> <section><h2>Children's privacy</h2><p>Free Game Zone is intended for a general audience. We do not knowingly ask children to submit personal information. If you believe a child has sent personal information, contact us so we can review it.</p></section> <section><h2>Contact</h2><p>Questions about privacy, copyright concerns, advertising, third-party content, or removal requests can be sent through the <a href="/contact-us">Contact us</a> page.</p></section> ` })}`}` })} ` })}`;
}, "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/pages/privacy-policy.astro", void 0);

const $$file = "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/pages/privacy-policy.astro";
const $$url = "/privacy-policy";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$PrivacyPolicy,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
