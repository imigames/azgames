globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate, h as addAttribute, m as maybeRenderHead } from '../../chunks/astro/server_jqlxmikg.mjs';
import { $ as $$AdminLayout } from '../../chunks/AdminLayout_DpMMXuWw.mjs';
import { s as supabaseAdmin } from '../../chunks/supabase_C3sp2Zx_.mjs';
export { renderers } from '../../renderers.mjs';

const reportStatuses = /* @__PURE__ */ new Set(["new", "resolved", "ignored"]);
const mapReport = (report) => ({
  id: report.id,
  gameId: report.game_id,
  gameSlug: report.game_slug ?? report.games?.slug ?? null,
  gameTitle: report.games?.title ?? report.game_slug ?? "Unknown game",
  reason: report.reason,
  details: report.details,
  status: report.status ?? "new",
  createdAt: report.created_at ?? ""
});
async function adminListReports(status = "") {
  if (!supabaseAdmin) {
    return { reports: [], error: "Supabase admin client is not configured." };
  }
  let query = supabaseAdmin.from("game_reports").select("id,game_id,game_slug,reason,details,status,created_at,games(title,slug)").order("created_at", { ascending: false }).limit(200);
  if (status && reportStatuses.has(status)) {
    query = query.eq("status", status);
  }
  const { data, error } = await query;
  if (error) {
    return { reports: [], error: error.message };
  }
  return { reports: (data ?? []).map((report) => mapReport(report)) };
}
async function adminUpdateReportStatus(id, status) {
  if (!supabaseAdmin) {
    return { success: false, error: "Supabase admin client is not configured." };
  }
  if (!reportStatuses.has(status)) {
    return { success: false, error: "Invalid report status." };
  }
  const { error } = await supabaseAdmin.from("game_reports").update({ status }).eq("id", id);
  return error ? { success: false, error: error.message } : { success: true };
}

const $$Astro = createAstro("https://freegamezone.io");
const prerender = false;
const $$Reports = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Reports;
  const allowedStatuses = /* @__PURE__ */ new Set(["new", "resolved", "ignored"]);
  const requestedStatus = Astro2.url.searchParams.get("status")?.trim() ?? "";
  const status = allowedStatuses.has(requestedStatus) ? requestedStatus : "";
  let actionError = "";
  let actionSuccess = "";
  if (Astro2.request.method === "POST") {
    const formData = await Astro2.request.formData();
    const id = String(formData.get("id") ?? "");
    const nextStatus = String(formData.get("status") ?? "");
    if (id && allowedStatuses.has(nextStatus)) {
      const result = await adminUpdateReportStatus(id, nextStatus);
      if (result.success) {
        actionSuccess = `Report marked as ${nextStatus}.`;
      } else {
        actionError = result.error ?? "Unable to update report.";
      }
    }
  }
  const { reports, error } = await adminListReports(status);
  const formatDate = (value) => {
    if (!value) {
      return "-";
    }
    return new Intl.DateTimeFormat("en", {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(new Date(value));
  };
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Admin Reports | Free Game Zone", "description": "Review player game reports." }, { "actions": async ($$result2) => renderTemplate`${maybeRenderHead()}<div class="admin-header-actions"> <a class="admin-link-btn" href="/admin/">Dashboard</a> <form method="post" action="/admin/"> <input type="hidden" name="intent" value="logout"> <button class="admin-logout-btn" type="submit">Logout</button> </form> </div>`, "default": async ($$result2) => renderTemplate`  <section class="admin-list-page" aria-labelledby="admin-reports-title"> <div class="admin-list-heading"> <div> <h1 id="admin-reports-title">Reports</h1> <p>${reports.length} report${reports.length === 1 ? "" : "s"} found</p> </div> </div> <form class="admin-filter-bar" method="get" action="/admin/reports"> <label> <span>Status</span> <select name="status"> <option value=""${addAttribute(status === "", "selected")}>All reports</option> <option value="new"${addAttribute(status === "new", "selected")}>New</option> <option value="resolved"${addAttribute(status === "resolved", "selected")}>Resolved</option> <option value="ignored"${addAttribute(status === "ignored", "selected")}>Ignored</option> </select> </label> <button type="submit">Filter</button> ${status && renderTemplate`<a class="admin-link-btn" href="/admin/reports">Clear</a>`} </form> ${error && renderTemplate`<p class="admin-error">${error}</p>`} ${actionError && renderTemplate`<p class="admin-error">${actionError}</p>`} ${actionSuccess && renderTemplate`<p class="admin-success">${actionSuccess}</p>`} <div class="admin-table-wrap"> <table class="admin-table"> <thead> <tr> <th>Game</th> <th>Slug</th> <th>Reason</th> <th>Details</th> <th>Status</th> <th>Created</th> <th>Actions</th> </tr> </thead> <tbody> ${reports.length > 0 ? reports.map((report) => renderTemplate`<tr> <td>${report.gameTitle}</td> <td> ${report.gameSlug ? renderTemplate`<a${addAttribute(`/game/${report.gameSlug}/`, "href")}><code>${report.gameSlug}</code></a>` : "-"} </td> <td>${report.reason}</td> <td>${report.details ?? "-"}</td> <td>${report.status}</td> <td>${formatDate(report.createdAt)}</td> <td> <div class="admin-table-actions"> <form method="post"${addAttribute(Astro2.url.pathname + Astro2.url.search, "action")}> <input type="hidden" name="id"${addAttribute(report.id, "value")}> <input type="hidden" name="status" value="resolved"> <button type="submit"${addAttribute(report.status === "resolved", "disabled")}>Resolve</button> </form> <form method="post"${addAttribute(Astro2.url.pathname + Astro2.url.search, "action")}> <input type="hidden" name="id"${addAttribute(report.id, "value")}> <input type="hidden" name="status" value="ignored"> <button type="submit"${addAttribute(report.status === "ignored", "disabled")}>Ignore</button> </form> </div> </td> </tr>`) : renderTemplate`<tr> <td colspan="7">No reports found.</td> </tr>`} </tbody> </table> </div> </section> ` })}`;
}, "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/pages/admin/reports.astro", void 0);

const $$file = "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/pages/admin/reports.astro";
const $$url = "/admin/reports";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Reports,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
