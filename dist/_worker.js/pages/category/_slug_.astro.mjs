globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate } from '../../chunks/astro/server_jqlxmikg.mjs';
import { $ as $$CategoryPageContent } from '../../chunks/CategoryPageContent_DKP5lT6x.mjs';
import { g as getCategoryPageSchemas, $ as $$JsonLd } from '../../chunks/schema_ByaQQO49.mjs';
import { $ as $$MainLayout } from '../../chunks/MainLayout_UmvZxwvK.mjs';
import { a as getCategoryBySlug } from '../../chunks/categories_Df5AheBz.mjs';
import { b as getGamesByCategory } from '../../chunks/games_BbdWArb0.mjs';
import { g as getPublicSettings } from '../../chunks/settings_CPS68JRK.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://freegamezone.io");
const prerender = false;
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const slug = Astro2.params.slug;
  if (!slug) {
    return new Response(null, { status: 404 });
  }
  const category = await getCategoryBySlug(slug);
  if (!category) {
    return new Response(null, { status: 404 });
  }
  const limit = 60;
  const requestedPage = Number(Astro2.url.searchParams.get("page") ?? "1");
  const page = Number.isFinite(requestedPage) ? Math.max(1, Math.trunc(requestedPage)) : 1;
  const categoryGamesPage = await getGamesByCategory(slug, { page, limit: limit + 1 });
  const hasNext = categoryGamesPage.length > limit;
  const categoryGames = categoryGamesPage.slice(0, limit);
  const title = category.name.endsWith("Games") ? category.name : `${category.name} Games`;
  const activeCategory = category.slug.replace(/-games$/, "");
  const canonicalSlug = slug.endsWith("-games") ? slug : `${slug}-games`;
  const basePath = `/category/${canonicalSlug}/`;
  const seoTitle = category.seoTitle ?? `${category.name} - Play Free Online Games`;
  const seoDescription = category.seoDescription ?? category.description ?? `Play free ${title.toLowerCase()} instantly in a compact browser games library.`;
  const canonicalPath = page > 1 ? `${basePath.replace(/\/$/, "")}?page=${page}` : basePath.replace(/\/$/, "");
  const settings = await getPublicSettings();
  const categoryPageSchemas = getCategoryPageSchemas({
    settings,
    category,
    games: categoryGames,
    pageUrl: canonicalPath
  });
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": seoTitle, "description": seoDescription, "activeCategory": activeCategory, "canonicalPath": canonicalPath, "image": category.image ?? "/images/og-placeholder.svg", "ogTitle": seoTitle, "ogDescription": seoDescription }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "JsonLd", $$JsonLd, { "schema": categoryPageSchemas })} ${renderComponent($$result2, "CategoryPageContent", $$CategoryPageContent, { "category": category, "games": categoryGames, "pagination": { page, hasNext, basePath } })} ` })}`;
}, "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/pages/category/[slug].astro", void 0);

const $$file = "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/pages/category/[slug].astro";
const $$url = "/category/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
