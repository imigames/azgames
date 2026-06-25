import type { APIRoute } from 'astro';
import { getCategories } from '../lib/categories';
import { getAllGames } from '../lib/games';
import { SITE_URL } from '../config/site';
import type { Game } from '../types/game';

export const prerender = false;

const gamePageSize = 500;

const toAbsoluteUrl = (path: string) => new URL(path, SITE_URL).toString();
const escapeXml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

const getCategoryPath = (slug: string) => `/category/${slug.endsWith('-games') ? slug : `${slug}-games`}`;

interface SitemapUrl {
  loc: string;
  lastmod?: string;
}

const getSitemapGames = async () => {
  const games: Game[] = [];
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

export const GET: APIRoute = async () => {
  const [categories, games] = await Promise.all([getCategories(), getSitemapGames()]);
  const staticPaths = [
    '/',
    '/new-games',
    '/trending-games',
    '/hot-games',
    '/popular-games',
    '/about-us',
    '/copyright-infringement-notice-procedure',
    '/contact-us',
    '/privacy-policy',
    '/term-of-use',
  ];
  const urls: SitemapUrl[] = [
    ...staticPaths.map((path) => ({ loc: toAbsoluteUrl(path) })),
    ...categories.map((category) => ({
      loc: toAbsoluteUrl(getCategoryPath(category.slug)),
    })),
    ...games.map((game) => ({
      loc: toAbsoluteUrl(`/game/${game.slug}`),
      lastmod: game.updatedAt ?? game.publishedAt ?? game.createdAt ?? undefined,
    })),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${escapeXml(url.loc)}</loc>${url.lastmod ? `
    <lastmod>${escapeXml(new Date(url.lastmod).toISOString())}</lastmod>` : ''}
  </url>`,
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
    },
  });
};
