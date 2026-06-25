globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate } from '../chunks/astro/server_jqlxmikg.mjs';
import { $ as $$CategoryPageContent } from '../chunks/CategoryPageContent_DKP5lT6x.mjs';
import { $ as $$MainLayout } from '../chunks/MainLayout_UmvZxwvK.mjs';
import { a as getCategoryBySlug } from '../chunks/categories_Df5AheBz.mjs';
import { b as getGamesByCategory } from '../chunks/games_BbdWArb0.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://freegamezone.io");
const $$IoGames = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$IoGames;
  const category = await getCategoryBySlug("io-games");
  if (!category) {
    return Astro2.redirect("/");
  }
  const categoryGames = await getGamesByCategory("io-games", { page: 1, limit: 60 });
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Io Games | Free Online Browser Games | Free Game Zone", "description": `Play ${categoryGames.length} free Io games online with fast arena, multiplayer, and arcade-style browser picks.`, "activeCategory": category.slug.replace(/-games$/, ""), "canonicalPath": "/category/io-games" }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "CategoryPageContent", $$CategoryPageContent, { "category": category, "games": categoryGames })} ` })}`;
}, "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/pages/io-games.astro", void 0);

const $$file = "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/pages/io-games.astro";
const $$url = "/io-games";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$IoGames,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
