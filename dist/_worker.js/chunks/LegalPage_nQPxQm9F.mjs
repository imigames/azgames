globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, f as createComponent, m as maybeRenderHead, o as renderSlot, r as renderTemplate } from './astro/server_jqlxmikg.mjs';

const $$Astro = createAstro("https://freegamezone.io");
const $$LegalPage = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$LegalPage;
  const { title } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="legal-page"> <article class="legal-content"> <h1>${title}</h1> ${renderSlot($$result, $$slots["default"])} </article> </div>`;
}, "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/components/LegalPage.astro", void 0);

export { $$LegalPage as $ };
