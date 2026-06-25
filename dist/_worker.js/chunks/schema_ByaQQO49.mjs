globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, f as createComponent, r as renderTemplate, u as unescapeHTML } from './astro/server_jqlxmikg.mjs';
import { b as SITE_URL, D as DEFAULT_DESCRIPTION, a as DEFAULT_TITLE, S as SITE_NAME } from './site_ByuoMtRy.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://freegamezone.io");
const $$JsonLd = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$JsonLd;
  const { schema = null } = Astro2.props;
  const safeJson = schema ? JSON.stringify(schema).replace(/</g, "\\u003c") : "";
  return renderTemplate`${schema && renderTemplate(_a || (_a = __template(['<script type="application/ld+json">', "<\/script>"])), unescapeHTML(safeJson))}`;
}, "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/components/JsonLd.astro", void 0);

const trimTrailingSlash = (value) => value.replace(/\/+$/, "");
const getBaseUrl = (settings) => trimTrailingSlash(settings?.siteUrl?.trim() || SITE_URL);
const getSiteName = (settings) => settings?.siteName?.trim() || SITE_NAME;
const getDefaultTitle = (settings) => settings?.defaultMetaTitle?.trim() || DEFAULT_TITLE;
const getDefaultDescription = (settings) => settings?.defaultMetaDescription?.trim() || DEFAULT_DESCRIPTION;
const getOrganizationId = (settings) => `${getBaseUrl(settings)}/#organization`;
const getWebSiteId = (settings) => `${getBaseUrl(settings)}/#website`;
const resolveUrl = (path, settings) => {
  if (!path) {
    return void 0;
  }
  if (/^https?:\/\//i.test(path)) {
    return path;
  }
  return `${getBaseUrl(settings)}${path.startsWith("/") ? path : `/${path}`}`;
};
const withoutEmpty = (schema) => Object.fromEntries(
  Object.entries(schema).filter(([, value]) => {
    if (value === null || value === void 0 || value === "") {
      return false;
    }
    if (Array.isArray(value) && value.length === 0) {
      return false;
    }
    return true;
  })
);
const gameUrl = (game, settings) => resolveUrl(`/game/${game.slug}`, settings);
const categoryUrl = (category, settings) => resolveUrl(`/category/${category.slug}`, settings);
const getOrganizationSchema = (settings) => withoutEmpty({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": getOrganizationId(settings),
  name: getSiteName(settings),
  url: getBaseUrl(settings),
  logo: resolveUrl(settings?.defaultOgImage || "/og-image.jpg", settings),
  image: resolveUrl(settings?.defaultOgImage || "/og-image.jpg", settings),
  email: settings?.contactEmail || void 0
});
const getWebSiteSchema = (settings) => withoutEmpty({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": getWebSiteId(settings),
  name: getSiteName(settings),
  url: getBaseUrl(settings),
  publisher: { "@id": getOrganizationId(settings) },
  potentialAction: {
    "@type": "SearchAction",
    target: `${getBaseUrl(settings)}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string"
  }
});
const getWebPageSchema = ({
  title,
  description,
  url,
  image,
  settings
}) => {
  const pageUrl = resolveUrl(url, settings);
  const pageIdBase = pageUrl ? pageUrl.replace(/\/+$/, "") : getBaseUrl(settings);
  return withoutEmpty({
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${pageIdBase}/#webpage`,
    name: title,
    description,
    url: pageUrl,
    image: resolveUrl(image, settings),
    isPartOf: {
      "@id": getWebSiteId(settings)
    },
    publisher: {
      "@id": getOrganizationId(settings)
    }
  });
};
const getBreadcrumbSchema = (items) => withoutEmpty({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map(
    (item, index) => withoutEmpty({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url ?? void 0
    })
  )
});
const getItemListSchema = ({
  name,
  items,
  settings
}) => withoutEmpty({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name,
  itemListElement: items.map(
    (item, index) => withoutEmpty({
      "@type": "ListItem",
      position: index + 1,
      url: resolveUrl(item.url ?? (item.slug ? `/game/${item.slug}` : void 0), settings),
      name: item.name ?? item.title,
      image: resolveUrl(item.image ?? item.thumbnail, settings)
    })
  )
});
const getHomePageSchemas = ({
  settings,
  topGames = []
}) => [
  getOrganizationSchema(settings),
  getWebSiteSchema(settings),
  getWebPageSchema({
    title: getDefaultTitle(settings),
    description: getDefaultDescription(settings),
    url: "/",
    image: settings?.defaultOgImage,
    settings
  }),
  ...topGames.length ? [
    getItemListSchema({
      name: "Top Games",
      items: topGames.map((game) => ({
        title: game.title,
        slug: game.slug,
        thumbnail: game.thumbnail
      })),
      settings
    })
  ] : []
];
const getCategoryPageSchemas = ({
  settings,
  category,
  games = [],
  pageUrl
}) => {
  const pageAbsoluteUrl = resolveUrl(pageUrl, settings);
  const pageIdBase = pageAbsoluteUrl ? pageAbsoluteUrl.replace(/\/+$/, "") : categoryUrl(category, settings);
  const itemListId = `${pageIdBase}#itemlist`;
  const itemListSchema = withoutEmpty({
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": itemListId,
    name: category.name,
    numberOfItems: games.length,
    itemListElement: games.map(
      (game, index) => withoutEmpty({
        "@type": "ListItem",
        position: index + 1,
        url: gameUrl(game, settings),
        name: game.title,
        image: resolveUrl(game.thumbnail, settings)
      })
    )
  });
  return [
    withoutEmpty({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": `${pageIdBase}#webpage`,
      url: pageAbsoluteUrl,
      name: category.name,
      description: category.seoDescription || category.description,
      image: resolveUrl(category.image, settings),
      isPartOf: {
        "@id": getWebSiteId(settings)
      },
      publisher: {
        "@id": getOrganizationId(settings)
      },
      mainEntity: {
        "@id": itemListId
      }
    }),
    getBreadcrumbSchema([
      { name: "Home", url: `${getBaseUrl(settings)}/` },
      { name: category.name, url: pageAbsoluteUrl }
    ]),
    itemListSchema
  ];
};
const getGamePageSchemas = ({
  settings,
  game,
  category,
  relatedGames: _relatedGames = []
}) => {
  const url = gameUrl(game, settings);
  const description = game.seoDescription || game.shortDescription || game.description;
  const videoGameId = `${url}#videogame`;
  const gameTags = game.tags;
  const keywords = Array.isArray(gameTags) ? gameTags.filter((tag) => typeof tag === "string" && tag.trim().length > 0).join(", ") : void 0;
  return [
    withoutEmpty({
      "@context": "https://schema.org",
      "@type": "VideoGame",
      "@id": videoGameId,
      name: game.title,
      url,
      description,
      image: resolveUrl(game.thumbnail, settings),
      genre: category?.name || game.categorySlug,
      applicationCategory: "Game",
      operatingSystem: "Web browser",
      isAccessibleForFree: true,
      datePublished: game.publishedAt,
      dateModified: game.updatedAt,
      publisher: {
        "@id": getOrganizationId(settings)
      },
      inLanguage: "en",
      keywords
    }),
    withoutEmpty({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: game.seoTitle || `${game.title} - Play Online`,
      description,
      image: resolveUrl(game.thumbnail, settings),
      isPartOf: {
        "@id": getWebSiteId(settings)
      },
      publisher: {
        "@id": getOrganizationId(settings)
      },
      mainEntity: {
        "@id": videoGameId
      }
    }),
    getBreadcrumbSchema([
      { name: "Home", url: `${getBaseUrl(settings)}/` },
      ...category ? [{ name: category.name, url: categoryUrl(category, settings) }] : [],
      { name: game.title, url }
    ])
  ];
};

export { $$JsonLd as $, getGamePageSchemas as a, getHomePageSchemas as b, getCategoryPageSchemas as g };
