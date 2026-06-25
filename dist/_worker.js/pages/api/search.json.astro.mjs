globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as getGamesBySlugs, s as searchGames } from '../../chunks/games_BbdWArb0.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const GET = async ({ url }) => {
  const query = url.searchParams.get("q")?.trim() ?? "";
  const slugs = url.searchParams.get("slugs")?.trim() ?? "";
  const requestedLimit = Number(url.searchParams.get("limit") ?? (slugs ? "100" : "8"));
  const limit = Number.isFinite(requestedLimit) ? Math.min(slugs ? 200 : 8, Math.max(1, Math.trunc(requestedLimit))) : 8;
  const games = slugs ? await getGamesBySlugs(slugs.split(","), limit) : query ? await searchGames(query, { page: 1, limit }) : [];
  return new Response(
    JSON.stringify(
      games.slice(0, limit).map((game) => ({
        title: game.title,
        slug: game.slug,
        thumbnail: game.thumbnail
      }))
    ),
    {
      headers: {
        "content-type": "application/json; charset=utf-8"
      }
    }
  );
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
