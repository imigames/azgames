globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate } from '../chunks/astro/server_jqlxmikg.mjs';
import { $ as $$GameListingPage } from '../chunks/GameListingPage_z0mEorvU.mjs';
import { $ as $$MainLayout } from '../chunks/MainLayout_UmvZxwvK.mjs';
import { h as getGamesByFlag } from '../chunks/games_BbdWArb0.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://freegamezone.io");
const $$TrendingGames = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$TrendingGames;
  const limit = 60;
  const requestedPage = Number(Astro2.url.searchParams.get("page") ?? "1");
  const page = Number.isFinite(requestedPage) ? Math.max(1, Math.trunc(requestedPage)) : 1;
  const gamesPage = await getGamesByFlag("isTrending", { page, limit: limit + 1 });
  const hasNext = gamesPage.length > limit;
  const games = gamesPage.slice(0, limit);
  const basePath = "/trending-games/";
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Trending Games | Free Online Browser Games | Free Game Zone", "description": "Play trending free browser games with fast arcade-style access.", "canonicalPath": page > 1 ? `${basePath.replace(/\/$/, "")}?page=${page}` : basePath.replace(/\/$/, "") }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "GameListingPage", $$GameListingPage, { "title": "Trending Games", "games": games, "page": page, "hasNext": hasNext, "basePath": basePath })} ` })}`;
}, "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/pages/trending-games.astro", void 0);

const $$file = "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/pages/trending-games.astro";
const $$url = "/trending-games";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$TrendingGames,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
