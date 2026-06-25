globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate, h as addAttribute, m as maybeRenderHead } from '../../chunks/astro/server_jqlxmikg.mjs';
import { $ as $$AdminLayout } from '../../chunks/AdminLayout_DpMMXuWw.mjs';
import { e as adminActivateGame, f as adminDeactivateGame, g as adminListGames, a as adminListGameCategories } from '../../chunks/games-admin_D029h912.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://freegamezone.io");
const prerender = false;
const $$Games = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Games;
  const limit = 40;
  let actionError = "";
  let actionSuccess = "";
  if (Astro2.request.method === "POST") {
    const formData = await Astro2.request.formData();
    const intent = String(formData.get("intent") ?? "");
    const id = String(formData.get("id") ?? "");
    if (intent === "activate" && id) {
      const result = await adminActivateGame(id);
      if (result.success) {
        actionSuccess = "Game activated.";
      } else {
        actionError = result.error ?? "Unable to activate game.";
      }
    }
    if (intent === "deactivate" && id) {
      const result = await adminDeactivateGame(id);
      if (result.success) {
        actionSuccess = "Game deactivated.";
      } else {
        actionError = result.error ?? "Unable to deactivate game.";
      }
    }
  }
  const search = Astro2.url.searchParams.get("search")?.trim() ?? "";
  const categorySlug = Astro2.url.searchParams.get("category")?.trim() ?? "";
  const requestedStatus = Astro2.url.searchParams.get("status")?.trim() ?? "all";
  const status = requestedStatus === "active" || requestedStatus === "inactive" ? requestedStatus : "all";
  const requestedContentStatus = Astro2.url.searchParams.get("content_status")?.trim() ?? "all";
  const contentStatus = requestedContentStatus === "missing_article" || requestedContentStatus === "missing_meta" || requestedContentStatus === "ready_cron" ? requestedContentStatus : "all";
  const requestedPage = Number(Astro2.url.searchParams.get("page") ?? "1");
  const page = Number.isFinite(requestedPage) ? Math.max(1, Math.trunc(requestedPage)) : 1;
  const [{ games, total, hasNext, error }, categories] = await Promise.all([
    adminListGames({
      search,
      categorySlug,
      status: status === "all" ? "" : status,
      contentStatus: contentStatus === "all" ? "" : contentStatus,
      page,
      limit
    }),
    adminListGameCategories()
  ]);
  const buildPageHref = (pageNumber) => {
    const params = new URLSearchParams();
    if (search) {
      params.set("search", search);
    }
    if (categorySlug) {
      params.set("category", categorySlug);
    }
    if (status !== "all") {
      params.set("status", status);
    }
    if (contentStatus !== "all") {
      params.set("content_status", contentStatus);
    }
    if (pageNumber > 1) {
      params.set("page", String(pageNumber));
    }
    const query = params.toString();
    return query ? `/admin/games?${query}` : "/admin/games";
  };
  const formatPlays = (plays) => new Intl.NumberFormat("en").format(plays);
  const getActionUrl = () => Astro2.url.pathname + Astro2.url.search;
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Admin Games | Free Game Zone", "description": "Manage games in the Free Game Zone admin area." }, { "actions": async ($$result2) => renderTemplate`${maybeRenderHead()}<div class="admin-header-actions"> <a class="admin-link-btn" href="/admin/">Dashboard</a> <a class="admin-link-btn" href="/admin/cron-publish">View Cron Publish Queue</a> <a class="admin-primary-btn" href="/admin/games/new">Add New Game</a> <form method="post" action="/admin/"> <input type="hidden" name="intent" value="logout"> <button class="admin-logout-btn" type="submit">Logout</button> </form> </div>`, "default": async ($$result2) => renderTemplate`  <section class="admin-list-page" aria-labelledby="admin-games-title"> <div class="admin-list-heading"> <div> <h1 id="admin-games-title">Games</h1> <p>${total} game${total === 1 ? "" : "s"} found</p> </div> </div> <form class="admin-filter-bar" method="get" action="/admin/games"> <label> <span>Search</span> <input type="search" name="search"${addAttribute(search, "value")} placeholder="Title or slug"> </label> <label> <span>Category</span> <select name="category"> <option value="">All categories</option> ${categories.map((category) => renderTemplate`<option${addAttribute(category.slug, "value")}${addAttribute(category.slug === categorySlug, "selected")}> ${category.name} </option>`)} </select> </label> <label> <span>Status</span> <select name="status"> <option value="all"${addAttribute(status === "all", "selected")}>All</option> <option value="active"${addAttribute(status === "active", "selected")}>Active</option> <option value="inactive"${addAttribute(status === "inactive", "selected")}>Inactive</option> </select> </label> <label> <span>Content status</span> <select name="content_status"> <option value="all"${addAttribute(contentStatus === "all", "selected")}>All</option> <option value="missing_article"${addAttribute(contentStatus === "missing_article", "selected")}>
Missing Article
</option> <option value="missing_meta"${addAttribute(contentStatus === "missing_meta", "selected")}>
Missing SEO Description
</option> <option value="ready_cron"${addAttribute(contentStatus === "ready_cron", "selected")}>
Ready for Cron Publish
</option> </select> </label> <button type="submit">Filter</button> ${(search || categorySlug || status !== "all" || contentStatus !== "all") && renderTemplate`<a class="admin-link-btn" href="/admin/games">Clear</a>`} </form> ${error && renderTemplate`<p class="admin-error">${error}</p>`} ${actionError && renderTemplate`<p class="admin-error">${actionError}</p>`} ${actionSuccess && renderTemplate`<p class="admin-success">${actionSuccess}</p>`} <div class="admin-table-wrap"> <table class="admin-table"> <thead> <tr> <th>Thumbnail</th> <th>Title</th> <th>Slug</th> <th>Category</th> <th>Active</th> <th>Article</th> <th>Meta</th> <th>New</th> <th>Trending</th> <th>Hot</th> <th>Popular</th> <th>Plays</th> <th>Actions</th> </tr> </thead> <tbody> ${games.length > 0 ? games.map((game) => renderTemplate`<tr> <td> <span class="admin-thumb"> ${game.thumbnail && renderTemplate`<img${addAttribute(game.thumbnail, "src")} alt="" loading="lazy" decoding="async">`} </span> </td> <td>${game.title}</td> <td><code>${game.slug}</code></td> <td>${game.categorySlug ?? "-"}</td> <td> <span${addAttribute(["admin-status-badge", game.isActive ? "is-ok" : "is-danger"], "class:list")}> ${game.isActive ? "Active" : "Inactive"} </span> </td> <td> <span${addAttribute(["admin-status-badge", game.hasArticle ? "is-ok" : "is-danger"], "class:list")}> ${game.hasArticle ? "Article Ready" : "Article Missing"} </span> </td> <td> <span${addAttribute(["admin-status-badge", game.hasMetaDescription ? "is-ok" : "is-danger"], "class:list")}> ${game.hasMetaDescription ? "Meta Ready" : "Meta Missing"} </span> </td> <td>${game.isNew ? "Yes" : "No"}</td> <td>${game.isTrending ? "Yes" : "No"}</td> <td>${game.isHot ? "Yes" : "No"}</td> <td>${game.isPopular ? "Yes" : "No"}</td> <td>${formatPlays(game.plays)}</td> <td> <div class="admin-table-actions"> <a${addAttribute(`/admin/games/${game.id}/edit`, "href")}>Edit</a> <a${addAttribute(`/game/${game.slug}/`, "href")}>View</a> ${game.isActive ? renderTemplate`<form method="post"${addAttribute(getActionUrl(), "action")}> <input type="hidden" name="intent" value="deactivate"> <input type="hidden" name="id"${addAttribute(game.id, "value")}> <button type="submit">Deactivate</button> </form>` : renderTemplate`<form method="post"${addAttribute(getActionUrl(), "action")}> <input type="hidden" name="intent" value="activate"> <input type="hidden" name="id"${addAttribute(game.id, "value")}> <button type="submit">Activate manually</button> </form>`} </div> </td> </tr>`) : renderTemplate`<tr> <td colspan="13">No games found.</td> </tr>`} </tbody> </table> </div> <nav class="pagination" aria-label="Admin games pagination"> ${page > 1 ? renderTemplate`<a class="pagination-link"${addAttribute(buildPageHref(page - 1), "href")}>Previous</a>` : renderTemplate`<span class="pagination-link pagination-link--disabled" aria-disabled="true">Previous</span>`} <span class="pagination-current">Page ${page}</span> ${hasNext ? renderTemplate`<a class="pagination-link"${addAttribute(buildPageHref(page + 1), "href")}>Next</a>` : renderTemplate`<span class="pagination-link pagination-link--disabled" aria-disabled="true">Next</span>`} </nav> </section> ` })}`;
}, "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/pages/admin/games.astro", void 0);

const $$file = "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/pages/admin/games.astro";
const $$url = "/admin/games";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Games,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
