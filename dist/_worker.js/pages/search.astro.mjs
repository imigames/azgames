globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_jqlxmikg.mjs';
import { $ as $$GameListingPage } from '../chunks/GameListingPage_z0mEorvU.mjs';
import { $ as $$MainLayout } from '../chunks/MainLayout_UmvZxwvK.mjs';
import { s as searchGames } from '../chunks/games_BbdWArb0.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://freegamezone.io");
const $$Search = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Search;
  const query = Astro2.url.searchParams.get("q")?.trim() ?? "";
  const requestedPage = Number(Astro2.url.searchParams.get("page") ?? "1");
  const page = Number.isFinite(requestedPage) ? Math.max(1, Math.trunc(requestedPage)) : 1;
  const limit = 40;
  const gamesPage = query ? await searchGames(query, { page, limit: limit + 1 }) : [];
  const hasNext = gamesPage.length > limit;
  const games = gamesPage.slice(0, limit);
  const basePath = query ? `/search?q=${encodeURIComponent(query)}` : "/search";
  const pageTitle = query ? `Search results for "${query}"` : "Search games";
  const description = query ? `Search free browser games matching ${query}.` : "Search free browser games on Free Game Zone.";
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": `${pageTitle} | Free Game Zone`, "description": description, "canonicalPath": page > 1 && query ? `${basePath}&page=${page}` : basePath }, { "default": async ($$result2) => renderTemplate`${query ? games.length > 0 ? renderTemplate`${renderComponent($$result2, "GameListingPage", $$GameListingPage, { "title": pageTitle, "games": games, "page": page, "hasNext": hasNext, "basePath": basePath })}` : renderTemplate`${maybeRenderHead()}<div class="category-page"> <header class="category-page-header"> <h1>${pageTitle}</h1> </header> <div class="favorites-page-empty">No games found</div> </div>` : renderTemplate`<div class="category-page"> <header class="category-page-header"> <h1>Search games</h1> </header> </div>`}` })}`;
}, "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/pages/search.astro", void 0);

const $$file = "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/pages/search.astro";
const $$url = "/search";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Search,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
