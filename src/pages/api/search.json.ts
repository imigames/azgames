import type { APIRoute } from 'astro';
import { getGamesBySlugs, searchGames } from '../../lib/games';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const query = url.searchParams.get('q')?.trim() ?? '';
  const slugs = url.searchParams.get('slugs')?.trim() ?? '';
  const requestedLimit = Number(url.searchParams.get('limit') ?? (slugs ? '100' : '8'));
  const limit = Number.isFinite(requestedLimit)
    ? Math.min(slugs ? 200 : 8, Math.max(1, Math.trunc(requestedLimit)))
    : 8;
  const games = slugs
    ? await getGamesBySlugs(slugs.split(','), limit)
    : query
      ? await searchGames(query, { page: 1, limit })
      : [];

  return new Response(
    JSON.stringify(
      games.slice(0, limit).map((game) => ({
        title: game.title,
        slug: game.slug,
        thumbnail: game.thumbnail,
      })),
    ),
    {
      headers: {
        'content-type': 'application/json; charset=utf-8',
      },
    },
  );
};
