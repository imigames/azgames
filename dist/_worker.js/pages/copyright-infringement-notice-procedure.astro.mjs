globalThis.process ??= {}; globalThis.process.env ??= {};
import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, u as unescapeHTML, l as Fragment } from '../chunks/astro/server_jqlxmikg.mjs';
import { $ as $$LegalPage } from '../chunks/LegalPage_nQPxQm9F.mjs';
import { $ as $$MainLayout } from '../chunks/MainLayout_UmvZxwvK.mjs';
import { s as sanitizeSiteContentHtml } from '../chunks/html-sanitize_DC9IPhPx.mjs';
import { g as getPublicSettings } from '../chunks/settings_CPS68JRK.mjs';
export { renderers } from '../renderers.mjs';

const $$CopyrightInfringementNoticeProcedure = createComponent(async ($$result, $$props, $$slots) => {
  const settings = await getPublicSettings();
  const customContent = settings.copyrightPolicyContent.trim() ? sanitizeSiteContentHtml(settings.copyrightPolicyContent) : "";
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Copyright infringement notice procedure | Free Game Zone", "description": "Review the Free Game Zone procedure for submitting copyright notices and game removal requests.", "canonicalPath": "/copyright-infringement-notice-procedure" }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "LegalPage", $$LegalPage, { "title": "Copyright infringement notice procedure" }, { "default": async ($$result3) => renderTemplate`${customContent ? renderTemplate`${maybeRenderHead()}<div class="game-article-content">${unescapeHTML(customContent)}</div>` : renderTemplate`${renderComponent($$result3, "Fragment", Fragment, {}, { "default": async ($$result4) => renderTemplate` <section> <h2>Copyright infringement notice procedure</h2> <p>Free Game Zone respects intellectual property rights. Some games or media shown on freegamezone.io may be provided by third-party developers, publishers, or external content providers. If you believe a page includes material that should be removed or reviewed, you can contact us with a copyright notice or game removal request.</p> </section> <section> <h2>How to submit a notice</h2> <p>Send your request through our <a href="/contact-us">Contact us</a> page. Please write a clear subject, describe the issue, and include the exact freegamezone.io URL of the game page or content you want us to review.</p> </section> <section> <h2>Required information</h2> <p>Please include your name, contact email, the copyrighted work or protected material, the page URL on freegamezone.io, and a short explanation of why you believe the content is not authorized. If you represent a rights owner, please mention your relationship to the owner.</p> </section> <section> <h2>What happens after we receive a notice</h2> <p>We review notices in a practical and good-faith way. We may ask for more information, update a page, remove a listing, disable access to a game, or contact the relevant third-party provider if needed.</p> </section> <section> <h2>Counter-notification note</h2> <p>If you believe content was removed or restricted by mistake, you may contact us with an explanation and supporting information. We will review the message and decide whether the content can be restored or adjusted.</p> </section> <section> <h2>Contact note</h2> <p>For faster review, use a subject such as "Copyright notice" or "Game removal request" and include all relevant links in one message.</p> </section> ` })}`}` })} ` })}`;
}, "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/pages/copyright-infringement-notice-procedure.astro", void 0);

const $$file = "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/pages/copyright-infringement-notice-procedure.astro";
const $$url = "/copyright-infringement-notice-procedure";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$CopyrightInfringementNoticeProcedure,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
