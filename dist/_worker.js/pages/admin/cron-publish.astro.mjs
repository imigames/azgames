globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, f as createComponent, r as renderTemplate, k as renderComponent, m as maybeRenderHead, h as addAttribute } from '../../chunks/astro/server_jqlxmikg.mjs';
import { $ as $$AdminLayout } from '../../chunks/AdminLayout_DpMMXuWw.mjs';
import { a as adminUpdateCronPublishSettings, r as runCronPublishOnce, b as adminGetCronPublishSettings, c as adminGetCronPublishStats, d as adminListInactiveGamesForCron, e as adminGetCronPublishLogs } from '../../chunks/cron-publish_CO3smaaZ.mjs';
import { a as adminListGameCategories } from '../../chunks/games-admin_D029h912.mjs';
export { renderers } from '../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://freegamezone.io");
const prerender = false;
const $$CronPublish = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$CronPublish;
  const allowedContentStatuses = /* @__PURE__ */ new Set(["all", "ready", "missing_article", "missing_meta"]);
  const limit = 40;
  let actionError = "";
  let actionSuccess = "";
  let runSummary = null;
  if (Astro2.request.method === "POST") {
    const formData = await Astro2.request.formData();
    const intent = String(formData.get("intent") ?? "");
    if (intent === "save-settings") {
      const result = await adminUpdateCronPublishSettings({
        enabled: formData.has("enabled"),
        batchSize: Number(formData.get("batchSize") ?? 2),
        maxPerDay: Number(formData.get("maxPerDay") ?? 20),
        intervalLabel: String(formData.get("intervalLabel") ?? "Every 1 hour"),
        requireArticle: formData.has("requireArticle"),
        requireMetaDescription: formData.has("requireMetaDescription"),
        articleMaxTokens: Number(formData.get("articleMaxTokens") ?? 1400),
        metaDescriptionMaxTokens: Number(formData.get("metaDescriptionMaxTokens") ?? 180),
        categoryFilter: String(formData.get("categoryFilter") ?? "all")
      });
      if (result.success) {
        actionSuccess = "Cron Publish settings saved.";
      } else {
        actionError = result.error ?? "Unable to save Cron Publish settings.";
      }
    }
    if (intent === "run-once") {
      runSummary = await runCronPublishOnce({ source: "manual" });
      if (runSummary.error) {
        actionError = runSummary.error;
      } else {
        const summaryText = `Processed ${runSummary.processed}, Published ${runSummary.published}, Failed ${runSummary.failed}, Skipped ${runSummary.skipped}.`;
        if (runSummary.failed > 0) {
          actionError = runSummary.message ? `${summaryText} ${runSummary.message}` : summaryText;
        } else {
          actionSuccess = runSummary.message ?? summaryText;
        }
      }
    }
  }
  const search = Astro2.url.searchParams.get("search")?.trim() ?? "";
  const categorySlug = Astro2.url.searchParams.get("category")?.trim() ?? "";
  const requestedContentStatus = Astro2.url.searchParams.get("content_status")?.trim() ?? "all";
  const contentStatus = allowedContentStatuses.has(requestedContentStatus) ? requestedContentStatus : "all";
  const requestedPage = Number(Astro2.url.searchParams.get("page") ?? "1");
  const page = Number.isFinite(requestedPage) ? Math.max(1, Math.trunc(requestedPage)) : 1;
  const [
    settingsResult,
    statsResult,
    inactiveResult,
    logsResult,
    categories
  ] = await Promise.all([
    adminGetCronPublishSettings(),
    adminGetCronPublishStats(),
    adminListInactiveGamesForCron({
      page,
      limit,
      search,
      categorySlug,
      contentStatus
    }),
    adminGetCronPublishLogs({ page: 1, limit: 20 }),
    adminListGameCategories()
  ]);
  const { settings } = settingsResult;
  const { stats } = statsResult;
  const { games, total, hasNext } = inactiveResult;
  const pageError = settingsResult.error ?? statsResult.error ?? inactiveResult.error ?? logsResult.error ?? "";
  const buildPageHref = (pageNumber) => {
    const params = new URLSearchParams();
    if (search) {
      params.set("search", search);
    }
    if (categorySlug) {
      params.set("category", categorySlug);
    }
    if (contentStatus !== "all") {
      params.set("content_status", contentStatus);
    }
    if (pageNumber > 1) {
      params.set("page", String(pageNumber));
    }
    const query = params.toString();
    return query ? `/admin/cron-publish?${query}` : "/admin/cron-publish";
  };
  const formatDate = (value) => {
    if (!value) {
      return "-";
    }
    return new Intl.DateTimeFormat("en", {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(new Date(value));
  };
  const formatStat = (value) => new Intl.NumberFormat("en").format(value);
  return renderTemplate(_a || (_a = __template(["", " <script>\n  (() => {\n    const form = document.querySelector('[data-cron-run-form]');\n    const button = document.querySelector('[data-cron-run-once]');\n    const message = document.querySelector('[data-cron-run-result]');\n\n    if (!(form instanceof HTMLFormElement)\n      || !(button instanceof HTMLButtonElement)\n      || !(message instanceof HTMLElement)) {\n      return;\n    }\n\n    form.addEventListener('submit', async (event) => {\n      event.preventDefault();\n      const originalText = button.textContent || 'Run once now';\n      button.disabled = true;\n      button.textContent = 'Running...';\n      message.hidden = true;\n      message.className = 'admin-success';\n\n      try {\n        const response = await fetch('/api/admin/cron-publish-run', {\n          method: 'POST',\n          headers: {\n            accept: 'application/json',\n          },\n          credentials: 'same-origin',\n        });\n        const result = await response.json().catch(() => ({}));\n\n        const summaryText = `Processed ${result.processed ?? 0}, Published ${result.published ?? 0}, Failed ${result.failed ?? 0}, Skipped ${result.skipped ?? 0}.`;\n\n        if (!response.ok || !result.ok || Number(result.failed ?? 0) > 0) {\n          message.className = 'admin-error';\n          message.textContent = result.message\n            ? `${summaryText} ${result.message}`\n            : 'Unable to run Cron Publish right now.';\n        } else {\n          message.textContent = summaryText;\n\n          if (result.message && result.message !== message.textContent) {\n            message.textContent += ` ${result.message}`;\n          }\n        }\n\n        message.hidden = false;\n      } catch {\n        message.className = 'admin-error';\n        message.textContent = 'Unable to run Cron Publish right now.';\n        message.hidden = false;\n      } finally {\n        button.disabled = false;\n        button.textContent = originalText;\n      }\n    });\n  })();\n<\/script>"], ["", " <script>\n  (() => {\n    const form = document.querySelector('[data-cron-run-form]');\n    const button = document.querySelector('[data-cron-run-once]');\n    const message = document.querySelector('[data-cron-run-result]');\n\n    if (!(form instanceof HTMLFormElement)\n      || !(button instanceof HTMLButtonElement)\n      || !(message instanceof HTMLElement)) {\n      return;\n    }\n\n    form.addEventListener('submit', async (event) => {\n      event.preventDefault();\n      const originalText = button.textContent || 'Run once now';\n      button.disabled = true;\n      button.textContent = 'Running...';\n      message.hidden = true;\n      message.className = 'admin-success';\n\n      try {\n        const response = await fetch('/api/admin/cron-publish-run', {\n          method: 'POST',\n          headers: {\n            accept: 'application/json',\n          },\n          credentials: 'same-origin',\n        });\n        const result = await response.json().catch(() => ({}));\n\n        const summaryText = \\`Processed \\${result.processed ?? 0}, Published \\${result.published ?? 0}, Failed \\${result.failed ?? 0}, Skipped \\${result.skipped ?? 0}.\\`;\n\n        if (!response.ok || !result.ok || Number(result.failed ?? 0) > 0) {\n          message.className = 'admin-error';\n          message.textContent = result.message\n            ? \\`\\${summaryText} \\${result.message}\\`\n            : 'Unable to run Cron Publish right now.';\n        } else {\n          message.textContent = summaryText;\n\n          if (result.message && result.message !== message.textContent) {\n            message.textContent += \\` \\${result.message}\\`;\n          }\n        }\n\n        message.hidden = false;\n      } catch {\n        message.className = 'admin-error';\n        message.textContent = 'Unable to run Cron Publish right now.';\n        message.hidden = false;\n      } finally {\n        button.disabled = false;\n        button.textContent = originalText;\n      }\n    });\n  })();\n<\/script>"])), renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Cron Publish | Free Game Zone", "description": "Automatically generate SEO content and publish inactive games gradually." }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="admin-list-page" aria-labelledby="admin-cron-publish-title"> <div class="admin-list-heading"> <div> <h1 id="admin-cron-publish-title">Cron Publish</h1> <p>Automatically generate SEO content and publish inactive games gradually.</p> </div> </div> ${pageError && renderTemplate`<p class="admin-error">${pageError}</p>`} ${actionError && renderTemplate`<p class="admin-error">${actionError}</p>`} ${actionSuccess && renderTemplate`<p class="admin-success">${actionSuccess}</p>`} ${runSummary && !runSummary.error && renderTemplate`<p class="admin-success">
Processed ${runSummary.processed}, Published ${runSummary.published}, Failed ${runSummary.failed}, Skipped ${runSummary.skipped} </p>`} <p class="admin-success" data-cron-run-result hidden></p> <form class="admin-game-form" method="post" action="/admin/cron-publish"> <input type="hidden" name="intent" value="save-settings"> <section class="admin-settings-section" aria-labelledby="cron-config-title"> <div class="admin-settings-section-heading"> <h2 id="cron-config-title">Configuration</h2> <p>Recommended: publish 2 games per hour with max 20 per day to avoid sudden mass indexing.</p> <p>Cron Publish always rewrites Article and SEO Description before activating a game.</p> <p>If OpenRouter credits are low, reduce Article max tokens or use a cheaper model.</p> </div> <div class="admin-checkbox-grid"> <label> <input type="checkbox" name="enabled"${addAttribute(settings.enabled, "checked")}>
Enable cron publish
</label> <label> <input type="checkbox" name="requireArticle"${addAttribute(settings.requireArticle, "checked")}>
Require fresh generated article before publish
</label> <label> <input type="checkbox" name="requireMetaDescription"${addAttribute(settings.requireMetaDescription, "checked")}>
Require fresh generated meta description before publish
</label> </div> <p>Publishing safety currently always generates and requires both fields, even if older saved settings differ.</p> <div class="admin-form-grid"> <label> <span>Batch size per run</span> <input type="number" name="batchSize" min="1" max="10"${addAttribute(settings.batchSize, "value")}> </label> <label> <span>Max games per day</span> <input type="number" name="maxPerDay" min="1" max="100"${addAttribute(settings.maxPerDay, "value")}> </label> <label> <span>Article max tokens</span> <input type="number" name="articleMaxTokens" min="300" max="1500"${addAttribute(settings.articleMaxTokens, "value")}> </label> <label> <span>Meta description max tokens</span> <input type="number" name="metaDescriptionMaxTokens" min="80" max="300"${addAttribute(settings.metaDescriptionMaxTokens, "value")}> </label> <label> <span>Interval label</span> <input type="text" name="intervalLabel"${addAttribute(settings.intervalLabel, "value")}> </label> <label> <span>Category filter</span> <select name="categoryFilter"> <option value="all"${addAttribute(settings.categoryFilter === "all", "selected")}>All categories</option> ${categories.map((category) => renderTemplate`<option${addAttribute(category.slug, "value")}${addAttribute(settings.categoryFilter === category.slug, "selected")}> ${category.name} </option>`)} </select> </label> </div> </section> <div class="admin-form-actions"> <button type="submit">Save settings</button> </div> </form> <form class="admin-form-card" method="post" action="/admin/cron-publish" data-cron-run-form> <input type="hidden" name="intent" value="run-once"> <strong>Manual run</strong> <p>Run once now ignores the enabled toggle, but still respects batch size and daily limits.</p> <div class="admin-form-actions"> <button type="submit" data-cron-run-once>Run once now</button> </div> </form> <div class="admin-card-grid" aria-label="Cron Publish stats"> <div class="admin-card admin-stat-card"> <h2>${formatStat(stats.inactiveGamesCount)}</h2> <p>Inactive games</p> </div> <div class="admin-card admin-stat-card"> <h2>${formatStat(stats.readyToPublishCount)}</h2> <p>Eligible for cron</p> </div> <div class="admin-card admin-stat-card"> <h2>${formatStat(stats.missingArticleCount)}</h2> <p>Missing article</p> </div> <div class="admin-card admin-stat-card"> <h2>${formatStat(stats.missingMetaDescriptionCount)}</h2> <p>Missing meta description</p> </div> <div class="admin-card admin-stat-card"> <h2>${formatStat(stats.publishedTodayCount)}</h2> <p>Published today</p> </div> <div class="admin-card admin-stat-card"> <h2>${formatDate(stats.lastRunAt)}</h2> <p>Last run time</p> </div> </div> <section class="admin-list-page" aria-labelledby="cron-inactive-games-title"> <div class="admin-list-heading"> <div> <h2 id="cron-inactive-games-title">Inactive games</h2> <p>${total} inactive game${total === 1 ? "" : "s"} found</p> <p>Cron Publish checks basic eligibility here, then rewrites Article and SEO Description during the run.</p> </div> </div> <form class="admin-filter-bar" method="get" action="/admin/cron-publish"> <label> <span>Search</span> <input type="search" name="search"${addAttribute(search, "value")} placeholder="Title or slug"> </label> <label> <span>Category</span> <select name="category"> <option value="">All categories</option> ${categories.map((category) => renderTemplate`<option${addAttribute(category.slug, "value")}${addAttribute(category.slug === categorySlug, "selected")}> ${category.name} </option>`)} </select> </label> <label> <span>Content status</span> <select name="content_status"> <option value="all"${addAttribute(contentStatus === "all", "selected")}>All</option> <option value="ready"${addAttribute(contentStatus === "ready", "selected")}>Eligible for cron</option> <option value="missing_article"${addAttribute(contentStatus === "missing_article", "selected")}>
Missing article
</option> <option value="missing_meta"${addAttribute(contentStatus === "missing_meta", "selected")}>
Missing meta
</option> </select> </label> <button type="submit">Filter</button> ${(search || categorySlug || contentStatus !== "all") && renderTemplate`<a class="admin-link-btn" href="/admin/cron-publish">Clear</a>`} </form> <div class="admin-table-wrap"> <table class="admin-table"> <thead> <tr> <th>Thumbnail</th> <th>Title</th> <th>Slug</th> <th>Category</th> <th>Article</th> <th>SEO Description</th> <th>Created</th> <th>Action</th> </tr> </thead> <tbody> ${games.length > 0 ? games.map((game) => renderTemplate`<tr> <td> <span class="admin-thumb"> ${game.thumbnail && renderTemplate`<img${addAttribute(game.thumbnail, "src")} alt="" loading="lazy" decoding="async">`} </span> </td> <td>${game.title}</td> <td><code>${game.slug}</code></td> <td>${game.categorySlug ?? "-"}</td> <td> <span${addAttribute(["admin-status-badge", game.hasArticle ? "is-ok" : "is-danger"], "class:list")}> ${game.hasArticle ? "Existing" : "Missing"} </span> </td> <td> <span${addAttribute(["admin-status-badge", game.hasMetaDescription ? "is-ok" : "is-danger"], "class:list")}> ${game.hasMetaDescription ? "Existing" : "Missing"} </span> </td> <td>${formatDate(game.createdAt)}</td> <td> <div class="admin-table-actions"> <a${addAttribute(`/admin/games/${game.id}/edit`, "href")}>Edit game</a> </div> </td> </tr>`) : renderTemplate`<tr> <td colspan="8">No inactive games found.</td> </tr>`} </tbody> </table> </div> <nav class="pagination" aria-label="Cron Publish inactive games pagination"> ${page > 1 ? renderTemplate`<a class="pagination-link"${addAttribute(buildPageHref(page - 1), "href")}>Previous</a>` : renderTemplate`<span class="pagination-link pagination-link--disabled" aria-disabled="true">Previous</span>`} <span class="pagination-current">Page ${page}</span> ${hasNext ? renderTemplate`<a class="pagination-link"${addAttribute(buildPageHref(page + 1), "href")}>Next</a>` : renderTemplate`<span class="pagination-link pagination-link--disabled" aria-disabled="true">Next</span>`} </nav> </section> <section class="admin-list-page" aria-labelledby="cron-logs-title"> <div class="admin-list-heading"> <div> <h2 id="cron-logs-title">Recent logs</h2> <p>Latest Cron Publish activity.</p> </div> </div> <div class="admin-table-wrap"> <table class="admin-table"> <thead> <tr> <th>Time</th> <th>Game slug</th> <th>Status</th> <th>Step</th> <th>Message</th> </tr> </thead> <tbody> ${logsResult.logs.length > 0 ? logsResult.logs.map((log) => renderTemplate`<tr> <td>${formatDate(log.createdAt)}</td> <td>${log.gameSlug ? renderTemplate`<code>${log.gameSlug}</code>` : "-"}</td> <td> <span${addAttribute([
    "admin-status-badge",
    log.status === "success" ? "is-ok" : log.status === "error" ? "is-danger" : "is-muted"
  ], "class:list")}> ${log.status} </span> </td> <td>${log.step ?? "-"}</td> <td>${log.errorMessage ?? log.message ?? "-"}</td> </tr>`) : renderTemplate`<tr> <td colspan="5">No Cron Publish logs yet.</td> </tr>`} </tbody> </table> </div> </section> </section> ` }));
}, "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/pages/admin/cron-publish.astro", void 0);

const $$file = "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/pages/admin/cron-publish.astro";
const $$url = "/admin/cron-publish";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$CronPublish,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
