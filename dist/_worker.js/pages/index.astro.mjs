globalThis.process ??= {}; globalThis.process.env ??= {};
import { f as createComponent, r as renderTemplate, k as renderComponent, m as maybeRenderHead, h as addAttribute, l as Fragment, u as unescapeHTML } from '../chunks/astro/server_jqlxmikg.mjs';
import { b as getHomePageSchemas, $ as $$JsonLd } from '../chunks/schema_ByaQQO49.mjs';
import { $ as $$MainLayout } from '../chunks/MainLayout_UmvZxwvK.mjs';
import { S as SITE_NAME, D as DEFAULT_DESCRIPTION, a as DEFAULT_TITLE } from '../chunks/site_ByuoMtRy.mjs';
import { g as getCategories } from '../chunks/categories_Df5AheBz.mjs';
import { d as getHomePageGames, j as getTrendingNowGames, g as getTopGames, f as getRandomGames } from '../chunks/games_BbdWArb0.mjs';
import { g as getPublicSettings } from '../chunks/settings_CPS68JRK.mjs';
import { a as sanitizeHomepageContentHtml } from '../chunks/html-sanitize_DC9IPhPx.mjs';
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const { newGames, trendingGames, hotGames, popularGames, featuredGames } = await getHomePageGames();
  const trendingNowGames = await getTrendingNowGames(4);
  const topGames = await getTopGames(12);
  const randomGames = await getRandomGames(80);
  const categories = await getCategories();
  const settings = await getPublicSettings();
  const homePageSchemas = getHomePageSchemas({ settings, topGames });
  const homepageArticleTitle = settings.homepageArticleTitle.trim() || SITE_NAME;
  const homepageArticleHtml = settings.homepageArticleContent.trim() ? sanitizeHomepageContentHtml(settings.homepageArticleContent) : "";
  const logoUrl = settings.siteLogoUrl.trim();
  const logoAlt = settings.siteLogoAlt.trim() || settings.siteName;
  const shortLogoText = settings.siteShortLogoText.trim();
  const shortLogoFallback = shortLogoText || settings.siteName.split(/\s+/).filter(Boolean).map((word) => word[0]).join("").slice(0, 4);
  const fallbackCategoryTiles = [
    { name: "Adventure Games", slug: "adventure-games" },
    { name: "Casual Games", slug: "casual-games" },
    { name: "Puzzle Games", slug: "puzzle-games" },
    { name: "Shooting Games", slug: "shooting-games" },
    { name: "Clicker Games", slug: "clicker-games" },
    { name: "Kids Games", slug: "kids-games" },
    { name: "Io Games", slug: "io-games" },
    { name: "Car Games", slug: "car-games" },
    { name: "Sports Games", slug: "sports-games" },
    { name: "2 Player Games", slug: "2-player-games" }
  ];
  const categoryTiles = (categories.length > 0 ? categories : fallbackCategoryTiles).slice(0, 36).map((category) => {
    const normalizedSlug = category.slug.replace(/-games$/, "");
    return {
      name: category.name,
      slug: category.slug.endsWith("-games") ? category.slug : `${category.slug}-games`,
      tone: normalizedSlug.replace(/[^a-z0-9-]/gi, "").toLowerCase() || "general"
    };
  });
  const uniqueGames = [
    ...trendingNowGames,
    ...topGames,
    ...newGames,
    ...trendingGames,
    ...hotGames,
    ...popularGames,
    ...featuredGames,
    ...randomGames
  ].filter((game, index, games) => games.findIndex((item) => item.slug === game.slug) === index);
  const mosaicGames = uniqueGames.slice(0, 96);
  const getTileSize = (index) => {
    const pattern = [
      "large",
      "small",
      "small",
      "medium",
      "small",
      "small",
      "wide",
      "small",
      "small",
      "small",
      "medium",
      "small",
      "small",
      "wide",
      "small",
      "small",
      "tall",
      "small",
      "small",
      "medium",
      "small",
      "small",
      "wide",
      "small",
      "small",
      "small",
      "large",
      "small",
      "small"
    ];
    return pattern[index % pattern.length];
  };
  const categoryIcons = ["\u{1F3CE}\uFE0F", "\u{1F9E9}", "\u26BD", "\u{1F3AF}", "\u{1F579}\uFE0F", "\u2728", "\u{1F3C6}", "\u{1F916}", "\u{1F9E0}", "\u2694\uFE0F", "\u{1F308}", "\u{1F680}"];
  return renderTemplate(_a || (_a = __template(["", ` <script>
  (() => {
    const homeFavoritesButton = document.querySelector('[data-poki-home-open-favorites]');
    const homeSearchButton = document.querySelector('[data-poki-home-open-search]');
    const hiddenFavoritesButton = document.querySelector('[data-nav-action="favorites"]');
    const hiddenMenuButton = document.querySelector('[data-nav-action="menu"]');
    const menuDrawer = document.querySelector('[data-menu-drawer]');

    homeFavoritesButton?.addEventListener('click', () => {
      hiddenFavoritesButton?.click();
    });

    homeSearchButton?.addEventListener('click', () => {
      hiddenMenuButton?.click();
      window.requestAnimationFrame(() => {
        menuDrawer?.querySelector('input[type="search"]')?.focus();
      });
    });
  })();
<\/script>`])), renderComponent($$result, "MainLayout", $$MainLayout, { "title": DEFAULT_TITLE, "description": DEFAULT_DESCRIPTION, "canonicalPath": "/" }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "JsonLd", $$JsonLd, { "schema": homePageSchemas })} ${maybeRenderHead()}<div class="home-page poki-home-page"> <h1 id="poki-home-heading" class="sr-only">Play free online games</h1> <section class="poki-mosaic-section" aria-labelledby="poki-mosaic-heading"> <h2 id="poki-mosaic-heading" class="sr-only">Popular games</h2> <div class="poki-mosaic-grid"> <div class="poki-home-logo-tile"${addAttribute(`${logoAlt} quick actions`, "aria-label")}> <a class="poki-home-logo-link" href="/"${addAttribute(`${logoAlt} home`, "aria-label")}> ${logoUrl ? renderTemplate`<img class="poki-home-logo-image"${addAttribute(logoUrl, "src")}${addAttribute(logoAlt, "alt")}>` : renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <span class="poki-home-logo-full" aria-hidden="true"> ${settings.siteName.split(/\s+/).filter(Boolean).map((word, index) => renderTemplate`<span${addAttribute(index === 1 ? "site-logo-accent" : "site-logo-main", "class")}>${word}</span>`)} </span> <span class="poki-home-logo-short" aria-hidden="true">${shortLogoFallback}</span> ` })}`} </a> <div class="poki-home-logo-tools" aria-label="Quick actions"> <button class="poki-home-logo-tool" type="button" data-poki-home-open-favorites aria-label="Open favorites"> <span aria-hidden="true">&#9825;</span> <span class="favorite-count-badge" data-favorites-count hidden>0</span> </button> <button class="poki-home-logo-tool" type="button" data-poki-home-open-search aria-label="Open search"> <span aria-hidden="true">&#8981;</span> </button> </div> </div> ${mosaicGames.map((game, index) => renderTemplate`<a${addAttribute(["poki-game-tile", `poki-game-tile--${getTileSize(index)}`], "class:list")}${addAttribute(`/game/${game.slug}/`, "href")}${addAttribute(`Play ${game.title}`, "aria-label")}> ${game.thumbnail ? renderTemplate`<img${addAttribute(game.thumbnail, "src")}${addAttribute(`${game.title} game thumbnail`, "alt")}${addAttribute(index < 6 ? "eager" : "lazy", "loading")} decoding="async" onerror="this.hidden = true">` : renderTemplate`<span class="poki-game-fallback">${game.title}</span>`} <span class="poki-game-title">${game.title}</span> </a>`)} </div> </section> <section class="poki-category-section" aria-labelledby="category-tiles-heading"> <div class="poki-section-heading"> <h2 id="category-tiles-heading">Browse by category</h2> </div> <div class="poki-category-grid"> ${categoryTiles.map((category, index) => renderTemplate`<a${addAttribute(["poki-category-tile", `poki-category-tile--${category.tone}`], "class:list")}${addAttribute(`/category/${category.slug}/`, "href")}> <i aria-hidden="true">${categoryIcons[index % categoryIcons.length]}</i> <span>${category.name}</span> </a>`)} </div> </section> <section class="seo-block poki-home-article" aria-labelledby="seo-heading"> <h2 id="seo-heading">${homepageArticleTitle}</h2> ${homepageArticleHtml ? renderTemplate`<div class="game-article-content">${unescapeHTML(homepageArticleHtml)}</div>` : renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <p>
Free Game Zone is a place for quick browser play, from fast arcade runs to thoughtful
              puzzle rounds and two-player challenges. Pick a title, open it in your browser, and start
              playing without waiting through a complicated setup.
</p> <p>
The library is organized around simple paths like <a href="#new">new games</a>,
<a href="#trending">trending games</a>, and category collections, so it is easy to jump
              from a familiar favorite to something unexpected.
</p> <h2>What makes Free Game Zone so appealing?</h2> <p>
The best arcade sites feel fast, visual, and easy to scan. This homepage keeps the focus on
              game art, compact rows, clear labels, and useful category shortcuts. Whether you want
<a href="/category/puzzle-games/">Puzzle Games</a>,
<a href="/category/car-games/">Car Games</a>, or
<a href="/category/io-games/">Io Games</a>, the page is built to help you find a playable
              option in a few seconds.
</p> <h2>Give us feedback</h2> <p>
Tell us which games deserve more attention, which categories should expand next, and what
              would make browsing smoother. Player feedback helps shape future updates, from better
              sorting to richer game pages and more useful recommendations.
</p> ` })}`} </section> </div> ` }));
}, "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/pages/index.astro", void 0);

const $$file = "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
