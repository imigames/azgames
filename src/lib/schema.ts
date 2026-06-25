import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  SITE_NAME,
  SITE_URL,
} from '../config/site';
import type { PublicSettings } from './settings';
import type { Category, Game } from '../types/game';

type JsonLdObject = Record<string, unknown>;

type SchemaSettings = Partial<PublicSettings> | null | undefined;

type WebPageSchemaInput = {
  title: string;
  description?: string | null;
  url: string;
  image?: string | null;
  settings?: SchemaSettings;
};

type BreadcrumbItem = {
  name: string;
  url?: string | null;
};

type ItemListItem = {
  name?: string | null;
  title?: string | null;
  url?: string | null;
  slug?: string | null;
  image?: string | null;
  thumbnail?: string | null;
};

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

const getBaseUrl = (settings?: SchemaSettings) =>
  trimTrailingSlash(settings?.siteUrl?.trim() || SITE_URL);

const getSiteName = (settings?: SchemaSettings) =>
  settings?.siteName?.trim() || SITE_NAME;

const getDefaultTitle = (settings?: SchemaSettings) =>
  settings?.defaultMetaTitle?.trim() || DEFAULT_TITLE;

const getDefaultDescription = (settings?: SchemaSettings) =>
  settings?.defaultMetaDescription?.trim() || DEFAULT_DESCRIPTION;

const getOrganizationId = (settings?: SchemaSettings) =>
  `${getBaseUrl(settings)}/#organization`;

const getWebSiteId = (settings?: SchemaSettings) =>
  `${getBaseUrl(settings)}/#website`;

export const getSiteUrl = (path = '') => {
  if (!path) {
    return `${getBaseUrl()}/`;
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${getBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`;
};

const resolveUrl = (path: string | null | undefined, settings?: SchemaSettings) => {
  if (!path) {
    return undefined;
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${getBaseUrl(settings)}${path.startsWith('/') ? path : `/${path}`}`;
};

const withoutEmpty = <T extends JsonLdObject>(schema: T): T =>
  Object.fromEntries(
    Object.entries(schema).filter(([, value]) => {
      if (value === null || value === undefined || value === '') {
        return false;
      }

      if (Array.isArray(value) && value.length === 0) {
        return false;
      }

      return true;
    }),
  ) as T;

const gameUrl = (game: Pick<Game, 'slug'>, settings?: SchemaSettings) =>
  resolveUrl(`/game/${game.slug}`, settings);

const categoryUrl = (category: Pick<Category, 'slug'>, settings?: SchemaSettings) =>
  resolveUrl(`/category/${category.slug}`, settings);

export const getOrganizationSchema = (settings?: SchemaSettings) =>
  withoutEmpty({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': getOrganizationId(settings),
    name: getSiteName(settings),
    url: getBaseUrl(settings),
    logo: resolveUrl(settings?.defaultOgImage || '/og-image.jpg', settings),
    image: resolveUrl(settings?.defaultOgImage || '/og-image.jpg', settings),
    email: settings?.contactEmail || undefined,
  });

export const getWebSiteSchema = (settings?: SchemaSettings) =>
  withoutEmpty({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': getWebSiteId(settings),
    name: getSiteName(settings),
    url: getBaseUrl(settings),
    publisher: { '@id': getOrganizationId(settings) },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${getBaseUrl(settings)}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  });

export const getWebPageSchema = ({
  title,
  description,
  url,
  image,
  settings,
}: WebPageSchemaInput) => {
  const pageUrl = resolveUrl(url, settings);
  const pageIdBase = pageUrl ? pageUrl.replace(/\/+$/, '') : getBaseUrl(settings);

  return withoutEmpty({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${pageIdBase}/#webpage`,
    name: title,
    description,
    url: pageUrl,
    image: resolveUrl(image, settings),
    isPartOf: {
      '@id': getWebSiteId(settings),
    },
    publisher: {
      '@id': getOrganizationId(settings),
    },
  });
};

export const getBreadcrumbSchema = (items: BreadcrumbItem[]) =>
  withoutEmpty({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) =>
      withoutEmpty({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url ?? undefined,
      }),
    ),
  });

export const getItemListSchema = ({
  name,
  items,
  settings,
}: {
  name: string;
  items: ItemListItem[];
  settings?: SchemaSettings;
}) =>
  withoutEmpty({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    itemListElement: items.map((item, index) =>
      withoutEmpty({
        '@type': 'ListItem',
        position: index + 1,
        url: resolveUrl(item.url ?? (item.slug ? `/game/${item.slug}` : undefined), settings),
        name: item.name ?? item.title,
        image: resolveUrl(item.image ?? item.thumbnail, settings),
      }),
    ),
  });

export const getHomePageSchemas = ({
  settings,
  topGames = [],
}: {
  settings?: SchemaSettings;
  topGames?: Game[];
}) => [
  getOrganizationSchema(settings),
  getWebSiteSchema(settings),
  getWebPageSchema({
    title: getDefaultTitle(settings),
    description: getDefaultDescription(settings),
    url: '/',
    image: settings?.defaultOgImage,
    settings,
  }),
  ...(topGames.length
    ? [
        getItemListSchema({
          name: 'Top Games',
          items: topGames.map((game) => ({
            title: game.title,
            slug: game.slug,
            thumbnail: game.thumbnail,
          })),
          settings,
        }),
      ]
    : []),
];

export const getCategoryPageSchemas = ({
  settings,
  category,
  games = [],
  pageUrl,
}: {
  settings?: SchemaSettings;
  category: Category;
  games?: Game[];
  pageUrl: string;
}) => {
  const pageAbsoluteUrl = resolveUrl(pageUrl, settings);
  const pageIdBase = pageAbsoluteUrl ? pageAbsoluteUrl.replace(/\/+$/, '') : categoryUrl(category, settings);
  const itemListId = `${pageIdBase}#itemlist`;
  const itemListSchema = withoutEmpty({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': itemListId,
    name: category.name,
    numberOfItems: games.length,
    itemListElement: games.map((game, index) =>
      withoutEmpty({
        '@type': 'ListItem',
        position: index + 1,
        url: gameUrl(game, settings),
        name: game.title,
        image: resolveUrl(game.thumbnail, settings),
      }),
    ),
  });

  return [
    withoutEmpty({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': `${pageIdBase}#webpage`,
      url: pageAbsoluteUrl,
      name: category.name,
      description: category.seoDescription || category.description,
      image: resolveUrl(category.image, settings),
      isPartOf: {
        '@id': getWebSiteId(settings),
      },
      publisher: {
        '@id': getOrganizationId(settings),
      },
      mainEntity: {
        '@id': itemListId,
      },
    }),
    getBreadcrumbSchema([
      { name: 'Home', url: `${getBaseUrl(settings)}/` },
      { name: category.name, url: pageAbsoluteUrl },
    ]),
    itemListSchema,
  ];
};

export const getGamePageSchemas = ({
  settings,
  game,
  category,
  relatedGames: _relatedGames = [],
}: {
  settings?: SchemaSettings;
  game: Game;
  category?: Category | null;
  relatedGames?: Game[];
}) => {
  const url = gameUrl(game, settings);
  const description = game.seoDescription || game.shortDescription || game.description;
  const videoGameId = `${url}#videogame`;
  const gameTags = (game as Game & { tags?: unknown }).tags;
  const keywords = Array.isArray(gameTags)
    ? gameTags.filter((tag): tag is string => typeof tag === 'string' && tag.trim().length > 0).join(', ')
    : undefined;

  return [
    withoutEmpty({
      '@context': 'https://schema.org',
      '@type': 'VideoGame',
      '@id': videoGameId,
      name: game.title,
      url,
      description,
      image: resolveUrl(game.thumbnail, settings),
      genre: category?.name || game.categorySlug,
      applicationCategory: 'Game',
      operatingSystem: 'Web browser',
      isAccessibleForFree: true,
      datePublished: game.publishedAt,
      dateModified: game.updatedAt,
      publisher: {
        '@id': getOrganizationId(settings),
      },
      inLanguage: 'en',
      keywords,
    }),
    withoutEmpty({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${url}#webpage`,
      url,
      name: game.seoTitle || `${game.title} - Play Online`,
      description,
      image: resolveUrl(game.thumbnail, settings),
      isPartOf: {
        '@id': getWebSiteId(settings),
      },
      publisher: {
        '@id': getOrganizationId(settings),
      },
      mainEntity: {
        '@id': videoGameId,
      },
    }),
    getBreadcrumbSchema([
      { name: 'Home', url: `${getBaseUrl(settings)}/` },
      ...(category
        ? [{ name: category.name, url: categoryUrl(category, settings) }]
        : []),
      { name: game.title, url },
    ]),
  ];
};
