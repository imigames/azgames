globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, f as createComponent, m as maybeRenderHead, h as addAttribute, k as renderComponent, r as renderTemplate } from './astro/server_jqlxmikg.mjs';
import { $ as $$GameCard } from './GameCard_CeQA5tCZ.mjs';

const $$Astro = createAstro("https://freegamezone.io");
const $$CategoryPageContent = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$CategoryPageContent;
  const { category, games, pagination } = Astro2.props;
  const pageTitle = category.name.endsWith("Games") ? category.name : `${category.name} Games`;
  const topGames = [...games].sort((first, second) => Number(second.rating) - Number(first.rating)).slice(0, 6);
  const newGames = games.filter((game) => game.isNew).slice(0, 6);
  const categoryName = category.name === "Io" || category.name === "Io Games" ? "IO" : category.name.toLowerCase();
  const getPageHref = (page) => page <= 1 ? pagination?.basePath : `${pagination?.basePath}?page=${page}`;
  return renderTemplate`${maybeRenderHead()}<div class="category-page poki-category-page"> <header class="category-page-header poki-category-hero"> <div> <p class="poki-category-kicker">Category</p> <h1>${pageTitle}</h1> </div> <span class="poki-category-count">${games.length} games</span> </header> <section class="category-game-grid poki-category-game-grid"${addAttribute(pageTitle, "aria-label")}> ${games.map((game, index) => renderTemplate`<div${addAttribute([
    "poki-category-game-cell",
    {
      "is-large": index % 12 === 0,
      "is-wide": index % 9 === 2
    }
  ], "class:list")}> ${renderComponent($$result, "GameCard", $$GameCard, { "game": game, "size": "medium" })} </div>`)} </section> ${pagination && renderTemplate`<nav class="pagination"${addAttribute(`${pageTitle} pagination`, "aria-label")}> ${pagination.page > 1 ? renderTemplate`<a class="pagination-link"${addAttribute(getPageHref(pagination.page - 1), "href")}>Previous</a>` : renderTemplate`<span class="pagination-link pagination-link--disabled" aria-disabled="true">Previous</span>`} <span class="pagination-current">Page ${pagination.page}</span> ${pagination.hasNext ? renderTemplate`<a class="pagination-link"${addAttribute(getPageHref(pagination.page + 1), "href")}>Next</a>` : renderTemplate`<span class="pagination-link pagination-link--disabled" aria-disabled="true">Next</span>`} </nav>`} <section class="category-seo-block" aria-labelledby="category-about-heading"> <h2 id="category-about-heading">About ${pageTitle}</h2> <p> ${pageTitle} bring together quick browser games that are easy to open, scan, and replay.
      This collection focuses on ${categoryName} experiences with compact sessions, clear goals,
      and instant access from any modern browser.
</p> <h2>What are the most popular ${pageTitle}</h2> <ul> ${topGames.map((game) => renderTemplate`<li> <a${addAttribute(`/game/${game.slug}/`, "href")}>${game.title}</a> </li>`)} </ul> <h2>What are the new ${pageTitle}</h2> <ul> ${(newGames.length > 0 ? newGames : games.slice(0, 6)).map((game) => renderTemplate`<li> <a${addAttribute(`/game/${game.slug}/`, "href")}>${game.title}</a> </li>`)} </ul> </section> </div>`;
}, "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/components/CategoryPageContent.astro", void 0);

export { $$CategoryPageContent as $ };
