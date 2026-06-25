import fallbackGames from '../data/games.json';
import { hasSupabaseEnv, supabase } from './supabase';
import type {
  Game,
  GameReportInput,
  HomePageGames,
  MutationResult,
  PaginationOptions,
} from '../types/game';

interface SupabaseGameRow {
  id: string;
  title: string;
  slug: string;
  category_slug: string | null;
  thumbnail: string | null;
  iframe_url: string;
  short_description: string | null;
  description: string | null;
  instructions: string | null;
  rating: number | string | null;
  plays: number | string | null;
  is_new: boolean | null;
  is_trending: boolean | null;
  is_hot: boolean | null;
  is_popular: boolean | null;
  is_featured: boolean | null;
  is_active: boolean | null;
  seo_title: string | null;
  seo_description: string | null;
  published_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

interface FallbackGame {
  id?: string | number;
  title: string;
  slug: string;
  categorySlug?: string;
  thumbnail?: string;
  iframeUrl?: string;
  description?: string;
  instructions?: string;
  rating?: number | string;
  plays?: number | string;
  isNew?: boolean;
  isTrending?: boolean;
  isHot?: boolean;
  isPopular?: boolean;
  isFeatured?: boolean;
  isActive?: boolean;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 40;
const HOME_LIMIT = 18;
const RANDOM_POOL_LIMIT = 200;

const getPagination = ({ page = DEFAULT_PAGE, limit = DEFAULT_LIMIT }: PaginationOptions = {}) => {
  const safePage = Math.max(1, Math.trunc(page));
  const safeLimit = Math.max(1, Math.trunc(limit));
  const from = (safePage - 1) * safeLimit;
  const to = from + safeLimit - 1;

  return { from, to, limit: safeLimit };
};

const parseNumber = (value: number | string | null | undefined, fallback = 0) => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : fallback;
  }

  if (!value) {
    return fallback;
  }

  const normalized = value.trim().toUpperCase();
  const amount = Number.parseFloat(normalized);

  if (Number.isNaN(amount)) {
    return fallback;
  }

  if (normalized.endsWith('M')) {
    return amount * 1_000_000;
  }

  if (normalized.endsWith('K')) {
    return amount * 1_000;
  }

  return amount;
};

const mapSupabaseGame = (game: SupabaseGameRow): Game => ({
  id: game.id,
  title: game.title,
  slug: game.slug,
  categorySlug: game.category_slug ?? '',
  thumbnail: game.thumbnail,
  iframeUrl: game.iframe_url,
  shortDescription: game.short_description,
  description: game.description,
  instructions: game.instructions,
  rating: parseNumber(game.rating, 4.5),
  plays: parseNumber(game.plays),
  isNew: Boolean(game.is_new),
  isTrending: Boolean(game.is_trending),
  isHot: Boolean(game.is_hot),
  isPopular: Boolean(game.is_popular),
  isFeatured: Boolean(game.is_featured),
  isActive: game.is_active !== false,
  seoTitle: game.seo_title,
  seoDescription: game.seo_description,
  publishedAt: game.published_at,
  createdAt: game.created_at,
  updatedAt: game.updated_at,
});

const mapFallbackGame = (game: FallbackGame): Game => ({
  id: String(game.id ?? game.slug),
  title: game.title,
  slug: game.slug,
  categorySlug: game.categorySlug ?? '',
  thumbnail: game.thumbnail ?? null,
  iframeUrl: game.iframeUrl ?? '',
  shortDescription: game.description ?? null,
  description: game.description ?? null,
  instructions: game.instructions ?? null,
  rating: parseNumber(game.rating, 4.5),
  plays: parseNumber(game.plays),
  isNew: Boolean(game.isNew),
  isTrending: Boolean(game.isTrending),
  isHot: Boolean(game.isHot),
  isPopular: Boolean(game.isPopular),
  isFeatured: Boolean(game.isFeatured),
  isActive: game.isActive !== false,
  seoTitle: null,
  seoDescription: null,
  publishedAt: null,
  createdAt: null,
  updatedAt: null,
});

const fallbackGameList = (fallbackGames as FallbackGame[])
  .map(mapFallbackGame)
  .filter((game) => game.isActive);

const getCategorySlugAliases = (categorySlug: string) => {
  const normalizedSlug = categorySlug.replace(/\/$/, '');
  const compactSlug = normalizedSlug.replace(/-games$/, '');
  return Array.from(new Set([normalizedSlug, compactSlug, `${compactSlug}-games`]));
};

const sortByPublished = (games: Game[]) => [...games].reverse();
const sortByRating = (games: Game[]) =>
  [...games].sort((first, second) => second.rating - first.rating);
const sortByPlays = (games: Game[]) => [...games].sort((first, second) => second.plays - first.plays);

const queryGames = () => {
  if (!supabase) {
    return null;
  }

  return supabase.from('games').select('*').eq('is_active', true);
};

const fallbackPage = (games: Game[], options?: PaginationOptions) => {
  const { from, limit } = getPagination(options);
  return games.slice(from, from + limit);
};

const shuffleGames = (games: Game[]) => {
  const shuffled = [...games];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled;
};

export async function getHomePageGames(): Promise<HomePageGames> {
  if (hasSupabaseEnv && supabase) {
    const [newGames, trendingGames, hotGames, popularGames, featuredGames] = await Promise.all([
      queryGames()?.eq('is_new', true).order('published_at', { ascending: false }).limit(HOME_LIMIT),
      queryGames()?.eq('is_trending', true).order('plays', { ascending: false }).limit(HOME_LIMIT),
      queryGames()?.eq('is_hot', true).order('rating', { ascending: false }).limit(HOME_LIMIT),
      queryGames()?.eq('is_popular', true).order('plays', { ascending: false }).limit(HOME_LIMIT),
      queryGames()?.eq('is_featured', true).order('published_at', { ascending: false }).limit(HOME_LIMIT),
    ]);

    if (
      newGames &&
      trendingGames &&
      hotGames &&
      popularGames &&
      featuredGames &&
      !newGames.error &&
      !trendingGames.error &&
      !hotGames.error &&
      !popularGames.error &&
      !featuredGames.error
    ) {
      return {
        newGames: (newGames.data ?? []).map(mapSupabaseGame),
        trendingGames: (trendingGames.data ?? []).map(mapSupabaseGame),
        hotGames: (hotGames.data ?? []).map(mapSupabaseGame),
        popularGames: (popularGames.data ?? []).map(mapSupabaseGame),
        featuredGames: (featuredGames.data ?? []).map(mapSupabaseGame),
      };
    }
  }

  return {
    newGames: sortByPublished(fallbackGameList.filter((game) => game.isNew)).slice(0, HOME_LIMIT),
    trendingGames: sortByPlays(fallbackGameList.filter((game) => game.isTrending)).slice(0, HOME_LIMIT),
    hotGames: sortByRating(fallbackGameList.filter((game) => game.isHot || game.rating >= 4.5)).slice(
      0,
      HOME_LIMIT,
    ),
    popularGames: sortByPlays(
      fallbackGameList.filter((game) => game.isPopular || game.plays > 0),
    ).slice(0, HOME_LIMIT),
    featuredGames: sortByPublished(fallbackGameList.filter((game) => game.isFeatured)).slice(
      0,
      HOME_LIMIT,
    ),
  };
}

export async function getAllGames(options: PaginationOptions = {}): Promise<Game[]> {
  const { from, to } = getPagination(options);

  if (hasSupabaseEnv) {
    const { data, error } =
      (await queryGames()?.order('published_at', { ascending: false }).range(from, to)) ?? {};

    if (!error && data) {
      return data.map(mapSupabaseGame);
    }
  }

  return fallbackPage(sortByPublished(fallbackGameList), options);
}

export async function getGameBySlug(slug: string): Promise<Game | null> {
  if (hasSupabaseEnv) {
    const { data, error } =
      (await queryGames()?.eq('slug', slug).maybeSingle<SupabaseGameRow>()) ?? {};

    if (!error && data) {
      return mapSupabaseGame(data);
    }
  }

  return fallbackGameList.find((game) => game.slug === slug) ?? null;
}

export async function getGamesByCategory(
  categorySlug: string,
  options: PaginationOptions = {},
): Promise<Game[]> {
  const { from, to } = getPagination(options);
  const categorySlugAliases = getCategorySlugAliases(categorySlug);

  if (hasSupabaseEnv) {
    const { data, error } =
      (await queryGames()
        ?.in('category_slug', categorySlugAliases)
        .order('published_at', { ascending: false })
        .range(from, to)) ?? {};

    if (!error && data) {
      return data.map(mapSupabaseGame);
    }
  }

  return fallbackPage(
    sortByPublished(
      fallbackGameList.filter((game) => categorySlugAliases.includes(game.categorySlug)),
    ),
    options,
  );
}

export async function getGamesByFlag(
  flag: 'isNew' | 'isTrending' | 'isHot' | 'isPopular' | 'isFeatured',
  options: PaginationOptions = {},
): Promise<Game[]> {
  const { from, to } = getPagination(options);
  const supabaseFlagMap = {
    isNew: 'is_new',
    isTrending: 'is_trending',
    isHot: 'is_hot',
    isPopular: 'is_popular',
    isFeatured: 'is_featured',
  } as const;

  if (hasSupabaseEnv && supabase) {
    const gamesQuery = queryGames();

    if (!gamesQuery) {
      return [];
    }

    const orderColumn =
      flag === 'isPopular' ? 'plays' : flag === 'isHot' ? 'rating' : 'published_at';
    const { data, error } = await gamesQuery
      .eq(supabaseFlagMap[flag], true)
      .order(orderColumn, { ascending: false })
      .range(from, to);

    if (!error && data) {
      return data.map(mapSupabaseGame);
    }
  }

  const filteredGames = fallbackGameList.filter((game) => {
    if (flag === 'isHot') {
      return game.isHot || game.rating >= 4.5;
    }

    if (flag === 'isPopular') {
      return game.isPopular || game.plays > 0;
    }

    return game[flag];
  });
  const sortedGames =
    flag === 'isPopular'
      ? sortByPlays(filteredGames)
      : flag === 'isHot'
        ? sortByRating(filteredGames)
        : sortByPublished(filteredGames);

  return fallbackPage(sortedGames, options);
}

export async function getRandomGames(limit = 12): Promise<Game[]> {
  const safeLimit = Math.max(1, Math.trunc(limit));
  const poolLimit = Math.min(RANDOM_POOL_LIMIT, Math.max(safeLimit * 12, safeLimit));

  if (hasSupabaseEnv && supabase) {
    const gamesQuery = queryGames();

    if (!gamesQuery) {
      return [];
    }

    const { data, error } = await gamesQuery
      .order('published_at', { ascending: false })
      .limit(poolLimit);

    if (!error && data) {
      return shuffleGames(data.map(mapSupabaseGame)).slice(0, safeLimit);
    }
  }

  return shuffleGames(fallbackGameList).slice(0, safeLimit);
}

export async function getTrendingNowGames(limit = 4): Promise<Game[]> {
  const safeLimit = Math.max(1, Math.trunc(limit));
  const selectedGames = new Map<string, Game>();

  const addUniqueGames = (games: Game[]) => {
    for (const game of games) {
      if (selectedGames.size >= safeLimit) {
        break;
      }

      if (!selectedGames.has(game.slug)) {
        selectedGames.set(game.slug, game);
      }
    }
  };

  if (hasSupabaseEnv && supabase) {
    const fetchFlaggedGames = async (
      flag: 'is_trending' | 'is_popular' | 'is_hot',
      orderColumn: 'plays' | 'rating' | 'published_at',
    ) => {
      if (selectedGames.size >= safeLimit) {
        return;
      }

      const gamesQuery = queryGames();

      if (!gamesQuery) {
        return;
      }

      const { data, error } = await gamesQuery
        .eq(flag, true)
        .order(orderColumn, { ascending: false })
        .limit(safeLimit);

      if (!error && data) {
        addUniqueGames(data.map(mapSupabaseGame));
      }
    };

    await fetchFlaggedGames('is_trending', 'plays');
    await fetchFlaggedGames('is_popular', 'plays');
    await fetchFlaggedGames('is_hot', 'rating');

    if (selectedGames.size < safeLimit) {
      const gamesQuery = queryGames();

      if (gamesQuery) {
        const { data, error } = await gamesQuery
          .order('plays', { ascending: false })
          .limit(safeLimit * 4);

        if (!error && data) {
          addUniqueGames(data.map(mapSupabaseGame));
        }
      }
    }

    return Array.from(selectedGames.values()).slice(0, safeLimit);
  }

  addUniqueGames(sortByPlays(fallbackGameList.filter((game) => game.isTrending)));
  addUniqueGames(sortByPlays(fallbackGameList.filter((game) => game.isPopular || game.plays > 0)));
  addUniqueGames(sortByRating(fallbackGameList.filter((game) => game.isHot || game.rating >= 4.5)));
  addUniqueGames(sortByPublished(fallbackGameList));

  return Array.from(selectedGames.values()).slice(0, safeLimit);
}

export async function getTopGames(limit = 12): Promise<Game[]> {
  const safeLimit = Math.max(1, Math.trunc(limit));
  const selectedGames = new Map<string, Game>();

  const addUniqueGames = (games: Game[]) => {
    for (const game of games) {
      if (selectedGames.size >= safeLimit) {
        break;
      }

      if (!selectedGames.has(game.slug)) {
        selectedGames.set(game.slug, game);
      }
    }
  };

  if (hasSupabaseEnv && supabase) {
    const fetchFlaggedGames = async (
      flag: 'is_popular' | 'is_hot' | 'is_trending',
      orderColumn: 'plays' | 'rating' | 'published_at',
    ) => {
      if (selectedGames.size >= safeLimit) {
        return;
      }

      const gamesQuery = queryGames();

      if (!gamesQuery) {
        return;
      }

      const { data, error } = await gamesQuery
        .eq(flag, true)
        .order(orderColumn, { ascending: false })
        .limit(safeLimit);

      if (!error && data) {
        addUniqueGames(data.map(mapSupabaseGame));
      }
    };

    await fetchFlaggedGames('is_popular', 'plays');
    await fetchFlaggedGames('is_hot', 'rating');
    await fetchFlaggedGames('is_trending', 'plays');

    if (selectedGames.size < safeLimit) {
      const gamesQuery = queryGames();

      if (gamesQuery) {
        const { data, error } = await gamesQuery
          .order('plays', { ascending: false })
          .limit(safeLimit * 3);

        if (!error && data) {
          addUniqueGames(data.map(mapSupabaseGame));
        }
      }
    }

    return Array.from(selectedGames.values()).slice(0, safeLimit);
  }

  addUniqueGames(sortByPlays(fallbackGameList.filter((game) => game.isPopular || game.plays > 0)));
  addUniqueGames(sortByRating(fallbackGameList.filter((game) => game.isHot || game.rating >= 4.5)));
  addUniqueGames(sortByPlays(fallbackGameList.filter((game) => game.isTrending)));
  addUniqueGames(sortByPlays(fallbackGameList));

  return Array.from(selectedGames.values()).slice(0, safeLimit);
}

export async function getRelatedGames(game: Game, limit = 12): Promise<Game[]> {
  const safeLimit = Math.min(12, Math.max(1, Math.trunc(limit)));

  if (hasSupabaseEnv) {
    const { data, error } =
      (await queryGames()
        ?.eq('category_slug', game.categorySlug)
        .neq('slug', game.slug)
        .order('plays', { ascending: false })
        .limit(safeLimit)) ?? {};

    if (!error && data) {
      return data.map(mapSupabaseGame);
    }
  }

  return sortByPlays(
    fallbackGameList.filter(
      (relatedGame) => relatedGame.categorySlug === game.categorySlug && relatedGame.slug !== game.slug,
    ),
  ).slice(0, safeLimit);
}

export async function searchGames(
  query: string,
  options: PaginationOptions = {},
): Promise<Game[]> {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return [];
  }

  const { from, to } = getPagination(options);

  if (hasSupabaseEnv) {
    const { data, error } =
      (await queryGames()
        ?.ilike('title', `%${normalizedQuery}%`)
        .order('plays', { ascending: false })
        .range(from, to)) ?? {};

    if (!error && data) {
      return data.map(mapSupabaseGame);
    }
  }

  return fallbackPage(
    fallbackGameList.filter((game) =>
      game.title.toLowerCase().includes(normalizedQuery.toLowerCase()),
    ),
    options,
  );
}

export async function getGamesBySlugs(slugs: string[], limit = 40): Promise<Game[]> {
  const safeSlugs = Array.from(
    new Set(slugs.map((slug) => slug.trim()).filter((slug) => slug.length > 0)),
  ).slice(0, Math.max(1, Math.trunc(limit)));

  if (safeSlugs.length === 0) {
    return [];
  }

  if (hasSupabaseEnv && supabase) {
    const gamesQuery = queryGames();

    if (!gamesQuery) {
      return [];
    }

    const { data, error } = await gamesQuery.in('slug', safeSlugs).limit(safeSlugs.length);

    if (!error && data) {
      const gamesBySlug = new Map(data.map((game) => [game.slug, mapSupabaseGame(game)]));
      return safeSlugs.flatMap((slug) => {
        const game = gamesBySlug.get(slug);
        return game ? [game] : [];
      });
    }
  }

  const gamesBySlug = new Map(fallbackGameList.map((game) => [game.slug, game]));
  return safeSlugs.flatMap((slug) => {
    const game = gamesBySlug.get(slug);
    return game ? [game] : [];
  });
}

export async function trackGameEvent(
  gameSlug: string,
  eventType: string,
): Promise<MutationResult> {
  if (!hasSupabaseEnv || !supabase) {
    return { success: true };
  }

  const { error } = await supabase.from('game_events').insert({
    game_slug: gameSlug,
    event_type: eventType,
  });

  return error ? { success: false, error: error.message } : { success: true };
}

export async function createGameReport({
  gameSlug,
  reason,
  details,
}: GameReportInput): Promise<MutationResult> {
  if (!hasSupabaseEnv || !supabase) {
    return { success: true };
  }

  const { error } = await supabase.from('game_reports').insert({
    game_slug: gameSlug,
    reason,
    details: details ?? null,
  });

  return error ? { success: false, error: error.message } : { success: true };
}
