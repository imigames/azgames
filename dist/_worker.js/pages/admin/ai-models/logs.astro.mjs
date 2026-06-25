globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate, h as addAttribute, m as maybeRenderHead } from '../../../chunks/astro/server_jqlxmikg.mjs';
import { $ as $$AdminLayout } from '../../../chunks/AdminLayout_DpMMXuWw.mjs';
import { a as adminListAiProviders, c as adminListGenerationLogs } from '../../../chunks/ai-providers_Dsks5SxJ.mjs';
export { renderers } from '../../../renderers.mjs';

const $$Astro = createAstro("https://freegamezone.io");
const prerender = false;
const $$Logs = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Logs;
  const limit = 30;
  const requestedPage = Number(Astro2.url.searchParams.get("page") ?? "1");
  const page = Number.isFinite(requestedPage) ? Math.max(1, Math.trunc(requestedPage)) : 1;
  const providerKey = Astro2.url.searchParams.get("provider")?.trim() ?? "";
  const targetType = Astro2.url.searchParams.get("target_type")?.trim() ?? "";
  const action = Astro2.url.searchParams.get("action")?.trim() ?? "";
  const status = Astro2.url.searchParams.get("status")?.trim() ?? "";
  const [providersResult, logsResult] = await Promise.all([
    adminListAiProviders(),
    adminListGenerationLogs({
      page,
      limit,
      providerKey,
      targetType,
      action,
      status
    })
  ]);
  const logs = logsResult.logs;
  const pageError = providersResult.error || logsResult.error || "";
  const targetTypes = ["test", "game", "category"];
  const statuses = ["success", "error"];
  const actions = [
    "test_generation",
    "generate_meta_description",
    "generate_game_article",
    "generate_category_description",
    "generate_category_seo_title",
    "generate_category_seo_description"
  ];
  const formatDate = (value) => value ? new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value)) : "-";
  const buildPageHref = (pageNumber) => {
    const params = new URLSearchParams();
    if (providerKey) params.set("provider", providerKey);
    if (targetType) params.set("target_type", targetType);
    if (action) params.set("action", action);
    if (status) params.set("status", status);
    if (pageNumber > 1) params.set("page", String(pageNumber));
    const query = params.toString();
    return query ? `/admin/ai-models/logs?${query}` : "/admin/ai-models/logs";
  };
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "AI Generation Logs | Free Game Zone", "description": "Review server-side AI generation attempts and outputs." }, { "actions": async ($$result2) => renderTemplate`${maybeRenderHead()}<div class="admin-header-actions"> <a class="admin-link-btn" href="/admin/ai-models">Ai Models</a> <a class="admin-link-btn" href="/admin/ai-models/test">Test AI Model</a> </div>`, "default": async ($$result2) => renderTemplate`  <section class="admin-list-page" aria-labelledby="admin-ai-logs-title"> <div class="admin-list-heading"> <div> <h1 id="admin-ai-logs-title">AI Generation Logs</h1> <p>Review prompts, results, providers, and errors from admin AI tools.</p> </div> </div> <form class="admin-filter-bar" method="get" action="/admin/ai-models/logs"> <label> <span>Provider</span> <select name="provider"> <option value="">All providers</option> ${providersResult.providers.map((provider) => renderTemplate`<option${addAttribute(provider.providerKey, "value")}${addAttribute(provider.providerKey === providerKey, "selected")}> ${provider.providerName} </option>`)} </select> </label> <label> <span>Target</span> <select name="target_type"> <option value="">All targets</option> ${targetTypes.map((type) => renderTemplate`<option${addAttribute(type, "value")}${addAttribute(type === targetType, "selected")}>${type}</option>`)} </select> </label> <label> <span>Action</span> <select name="action"> <option value="">All actions</option> ${actions.map((item) => renderTemplate`<option${addAttribute(item, "value")}${addAttribute(item === action, "selected")}>${item}</option>`)} </select> </label> <label> <span>Status</span> <select name="status"> <option value="">All statuses</option> ${statuses.map((item) => renderTemplate`<option${addAttribute(item, "value")}${addAttribute(item === status, "selected")}>${item}</option>`)} </select> </label> <button type="submit">Filter</button> ${(providerKey || targetType || action || status) && renderTemplate`<a class="admin-link-btn" href="/admin/ai-models/logs">Clear</a>`} </form> ${pageError && renderTemplate`<p class="admin-error">${pageError}</p>`} <div class="admin-table-wrap"> <table class="admin-table admin-ai-logs-table"> <thead> <tr> <th>Created</th> <th>Provider</th> <th>Model</th> <th>Target</th> <th>Slug</th> <th>Action</th> <th>Status</th> <th>Error</th> <th>Details</th> </tr> </thead> <tbody> ${logs.length > 0 ? logs.map((log) => renderTemplate`<tr> <td>${formatDate(log.createdAt)}</td> <td>${log.providerKey ?? "-"}</td> <td class="admin-text-compact">${log.model ?? "-"}</td> <td>${log.targetType}</td> <td>${log.targetSlug ?? "-"}</td> <td class="admin-text-compact">${log.action}</td> <td> <span${addAttribute(["admin-status-badge", log.status === "success" ? "is-ok" : "is-muted"], "class:list")}> ${log.status} </span> </td> <td class="admin-text-compact">${log.errorMessage ?? "-"}</td> <td> <details class="admin-log-details"> <summary>View</summary> <div> <strong>Prompt</strong> <pre>${log.prompt || "No prompt saved."}</pre> </div> <div> <strong>Result</strong> <pre>${log.result || "No result saved."}</pre> </div> </details> </td> </tr>`) : renderTemplate`<tr> <td colspan="9">No generation logs found.</td> </tr>`} </tbody> </table> </div> <nav class="pagination" aria-label="AI generation logs pagination"> ${page > 1 ? renderTemplate`<a class="pagination-link"${addAttribute(buildPageHref(page - 1), "href")}>Previous</a>` : renderTemplate`<span class="pagination-link pagination-link--disabled" aria-disabled="true">Previous</span>`} <span class="pagination-current">Page ${page}</span> ${logsResult.hasNext ? renderTemplate`<a class="pagination-link"${addAttribute(buildPageHref(page + 1), "href")}>Next</a>` : renderTemplate`<span class="pagination-link pagination-link--disabled" aria-disabled="true">Next</span>`} </nav> </section> ` })}`;
}, "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/pages/admin/ai-models/logs.astro", void 0);

const $$file = "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/pages/admin/ai-models/logs.astro";
const $$url = "/admin/ai-models/logs";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Logs,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
