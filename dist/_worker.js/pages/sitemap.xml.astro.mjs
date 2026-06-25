globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as getCategories } from '../chunks/categories_Df5AheBz.mjs';
import { i as getAllGames } from '../chunks/games_BbdWArb0.mjs';
import { b as SITE_URL } from '../chunks/site_ByuoMtRy.mjs';
export { renderers } from '../renderers.mjs';

const prerender = false;
const gamePageSize = 500;
const toAbsoluteUrl = (path) => new URL(path, SITE_URL).toString();
const escapeXml = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");
const getCategoryPath = (slug) => `/category/${slug.endsWith("-games") ? slug : `${slug}-games`}`;
const getSitemapGames = async () => {
  const games = [];
  let page = 1;
  while (true) {
    const pageGames = await getAllGames({ page, limit: gamePageSize });
    games.push(...pageGames);
    if (pageGames.length < gamePageSize) {
      break;
    }
    page += 1;
  }
  return games;
};
const GET = async () => {
  const [categories, games] = await Promise.all([getCategories(), getSitemapGames()]);
  const staticPaths = [
    "/",
    "/new-games",
    "/trending-games",
    "/hot-games",
    "/popular-games",
    "/about-us",
    "/copyright-infringement-notice-procedure",
    "/contact-us",
    "/privacy-policy",
    "/term-of-use"
  ];
  const urls = [
    ...staticPaths.map((path) => ({ loc: toAbsoluteUrl(path) })),
    ...categories.map((category) => ({
      loc: toAbsoluteUrl(getCategoryPath(category.slug))
    })),
    ...games.map((game) => ({
      loc: toAbsoluteUrl(`/game/${game.slug}`),
      lastmod: game.updatedAt ?? game.publishedAt ?? game.createdAt ?? void 0
    }))
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(
    (url) => `  <url>
    <loc>${escapeXml(url.loc)}</loc>${url.lastmod ? `
    <lastmod>${escapeXml(new Date(url.lastmod).toISOString())}</lastmod>` : ""}
  </url>`
  ).join("\n")}
</urlset>`;
  return new Response(xml, {
    headers: {
      "content-type": "application/xml; charset=utf-8"
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
