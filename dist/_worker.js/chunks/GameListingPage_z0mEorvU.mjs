globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, f as createComponent, m as maybeRenderHead, h as addAttribute, k as renderComponent, r as renderTemplate } from './astro/server_jqlxmikg.mjs';
import { $ as $$GameCard } from './GameCard_CeQA5tCZ.mjs';

const $$Astro = createAstro("https://freegamezone.io");
const $$GameListingPage = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$GameListingPage;
  const { title, games, page, hasNext, basePath } = Astro2.props;
  const getPageHref = (pageNumber) => pageNumber <= 1 ? basePath : `${basePath}${basePath.includes("?") ? "&" : "?"}page=${pageNumber}`;
  return renderTemplate`${maybeRenderHead()}<div class="category-page"> <header class="category-page-header"> <h1>${title}</h1> </header> <section class="category-game-grid"${addAttribute(title, "aria-label")}> ${games.map((game) => renderTemplate`${renderComponent($$result, "GameCard", $$GameCard, { "game": game, "size": "small" })}`)} </section> <nav class="pagination"${addAttribute(`${title} pagination`, "aria-label")}> ${page > 1 ? renderTemplate`<a class="pagination-link"${addAttribute(getPageHref(page - 1), "href")}>Previous</a>` : renderTemplate`<span class="pagination-link pagination-link--disabled" aria-disabled="true">Previous</span>`} <span class="pagination-current">Page ${page}</span> ${hasNext ? renderTemplate`<a class="pagination-link"${addAttribute(getPageHref(page + 1), "href")}>Next</a>` : renderTemplate`<span class="pagination-link pagination-link--disabled" aria-disabled="true">Next</span>`} </nav> </div>`;
}, "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/components/GameListingPage.astro", void 0);

export { $$GameListingPage as $ };
