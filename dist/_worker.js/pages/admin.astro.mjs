globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate, h as addAttribute, m as maybeRenderHead } from '../chunks/astro/server_jqlxmikg.mjs';
import { $ as $$AdminLayout } from '../chunks/AdminLayout_DpMMXuWw.mjs';
import { s as supabaseAdmin, g as getSupabaseAdminConfigError } from '../chunks/supabase_C3sp2Zx_.mjs';
export { renderers } from '../renderers.mjs';

const getCount = async (table) => {
  if (!supabaseAdmin) {
    return { count: 0, error: getSupabaseAdminConfigError() };
  }
  const { count, error } = await supabaseAdmin.from(table).select("id", { count: "exact", head: true });
  return { count: count ?? 0, error: error?.message };
};
const getCommentCount = async (status) => {
  if (!supabaseAdmin) {
    return { count: 0, error: getSupabaseAdminConfigError() };
  }
  const { count, error } = await supabaseAdmin.from("game_comments").select("id", { count: "exact", head: true }).eq("status", status);
  return { count: count ?? 0, error: error?.message };
};
const getContactMessageCount = async (status) => {
  if (!supabaseAdmin) {
    return { count: 0, error: getSupabaseAdminConfigError() };
  }
  let query = supabaseAdmin.from("contact_messages").select("id", { count: "exact", head: true });
  if (status) {
    query = query.eq("status", status);
  }
  const { count, error } = await query;
  return { count: count ?? 0, error: error?.message };
};
const getPromptTemplateCount = async (activeOnly = false) => {
  if (!supabaseAdmin) {
    return { count: 0, error: getSupabaseAdminConfigError() };
  }
  let query = supabaseAdmin.from("ai_prompt_templates").select("id", { count: "exact", head: true });
  if (activeOnly) {
    query = query.eq("is_active", true);
  }
  const { count, error } = await query;
  return { count: count ?? 0, error: error?.message };
};
async function adminGetDashboardStats() {
  if (!supabaseAdmin) {
    return {
      totalGames: 0,
      totalReports: 0,
      totalPlays: 0,
      pendingComments: 0,
      approvedComments: 0,
      newContactMessages: 0,
      totalContactMessages: 0,
      activePromptTemplates: 0,
      totalPromptTemplates: 0,
      error: getSupabaseAdminConfigError()
    };
  }
  const [
    gamesResult,
    reportsResult,
    pendingCommentsResult,
    approvedCommentsResult,
    newContactMessagesResult,
    totalContactMessagesResult,
    activePromptTemplatesResult,
    totalPromptTemplatesResult,
    playsResult
  ] = await Promise.all([
    getCount("games"),
    getCount("game_reports"),
    getCommentCount("pending"),
    getCommentCount("approved"),
    getContactMessageCount("new"),
    getContactMessageCount(),
    getPromptTemplateCount(true),
    getPromptTemplateCount(),
    supabaseAdmin.from("games").select("plays")
  ]);
  if (gamesResult.error || reportsResult.error || pendingCommentsResult.error || approvedCommentsResult.error || newContactMessagesResult.error || totalContactMessagesResult.error || activePromptTemplatesResult.error || totalPromptTemplatesResult.error || playsResult.error) {
    return {
      totalGames: gamesResult.count,
      totalReports: reportsResult.count,
      pendingComments: pendingCommentsResult.count,
      approvedComments: approvedCommentsResult.count,
      newContactMessages: newContactMessagesResult.count,
      totalContactMessages: totalContactMessagesResult.count,
      activePromptTemplates: activePromptTemplatesResult.count,
      totalPromptTemplates: totalPromptTemplatesResult.count,
      totalPlays: 0,
      error: gamesResult.error ?? reportsResult.error ?? pendingCommentsResult.error ?? approvedCommentsResult.error ?? newContactMessagesResult.error ?? totalContactMessagesResult.error ?? activePromptTemplatesResult.error ?? totalPromptTemplatesResult.error ?? playsResult.error?.message
    };
  }
  const totalPlays = (playsResult.data ?? []).reduce((total, game) => {
    const plays = typeof game.plays === "number" ? game.plays : Number.parseInt(String(game.plays ?? "0"), 10);
    return total + (Number.isNaN(plays) ? 0 : plays);
  }, 0);
  return {
    totalGames: gamesResult.count,
    totalReports: reportsResult.count,
    pendingComments: pendingCommentsResult.count,
    approvedComments: approvedCommentsResult.count,
    newContactMessages: newContactMessagesResult.count,
    totalContactMessages: totalContactMessagesResult.count,
    activePromptTemplates: activePromptTemplatesResult.count,
    totalPromptTemplates: totalPromptTemplatesResult.count,
    totalPlays
  };
}

const $$Astro = createAstro("https://freegamezone.io");
const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const ACCESS_COOKIE = "admin-access-token";
  const REFRESH_COOKIE = "admin-refresh-token";
  if (Astro2.request.method === "POST") {
    const formData = await Astro2.request.formData();
    if (formData.get("intent") === "logout") {
      Astro2.cookies.delete(ACCESS_COOKIE, { path: "/" });
      Astro2.cookies.delete(REFRESH_COOKIE, { path: "/" });
      return Astro2.redirect("/admin/login");
    }
  }
  const adminCards = [
    { title: "Games", text: "Manage game records and publishing state.", href: "/admin/games" },
    { title: "Categories", text: "Organize game collections and SEO metadata.", href: "/admin/categories" },
    { title: "Reports", text: "Review player reports and moderation notes.", href: "/admin/reports" },
    { title: "Comments", text: "Moderate player comments before they appear publicly.", href: "/admin/comments" },
    { title: "Contact Messages", text: "Review visitor feedback and business inquiries.", href: "/admin/contact-us" },
    { title: "Import", text: "Prepare bulk imports from files or providers.", href: "/admin/import" },
    {
      title: "Prompt Templates",
      text: "Manage AI prompts for game and category SEO generation.",
      href: "/admin/prompt-templates",
      icon: "PT"
    },
    {
      title: "Settings",
      text: "Manage website metadata, SEO defaults, and global site options.",
      href: "/admin/settings",
      icon: "\u2699\uFE0F"
    }
  ];
  const stats = await adminGetDashboardStats();
  const formatNumber = (value) => new Intl.NumberFormat("en").format(value);
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Admin Dashboard | Free Game Zone", "description": "Free Game Zone admin dashboard." }, { "actions": async ($$result2) => renderTemplate`${maybeRenderHead()}<form method="post" action="/admin/"> <input type="hidden" name="intent" value="logout"> <button class="admin-logout-btn" type="submit">Logout</button> </form>`, "default": async ($$result2) => renderTemplate`  <section class="admin-dashboard" aria-labelledby="admin-dashboard-title"> <div> <h1 id="admin-dashboard-title">Admin Dashboard</h1> <p>Choose a section to manage. CRUD tools will be added in a later step.</p> </div> ${stats.error && renderTemplate`<p class="admin-error">${stats.error}</p>`} <div class="admin-card-grid"> <div class="admin-card admin-stat-card"> <h2>${formatNumber(stats.totalGames)}</h2> <p>Total games</p> </div> <div class="admin-card admin-stat-card"> <h2>${formatNumber(stats.totalReports)}</h2> <p>Total reports</p> </div> <div class="admin-card admin-stat-card"> <h2>${formatNumber(stats.pendingComments)}</h2> <p>Pending comments</p> </div> <div class="admin-card admin-stat-card"> <h2>${formatNumber(stats.approvedComments)}</h2> <p>Approved comments</p> </div> <div class="admin-card admin-stat-card"> <h2>${formatNumber(stats.newContactMessages)}</h2> <p>New contact messages</p> </div> <div class="admin-card admin-stat-card"> <h2>${formatNumber(stats.totalContactMessages)}</h2> <p>Total contact messages</p> </div> <div class="admin-card admin-stat-card"> <h2>${formatNumber(stats.totalPlays)}</h2> <p>Total plays</p> </div> <div class="admin-card admin-stat-card"> <h2>${formatNumber(stats.activePromptTemplates)}</h2> <p>Active prompt templates</p> </div> <div class="admin-card admin-stat-card"> <h2>${formatNumber(stats.totalPromptTemplates)}</h2> <p>Total prompt templates</p> </div> </div> <div class="admin-card-grid"> ${adminCards.map((card) => renderTemplate`<a class="admin-card"${addAttribute(card.href, "href")}> <h2>${card.icon && renderTemplate`<span class="admin-card-icon" aria-hidden="true">${card.icon}</span>`}${card.title}</h2> <p>${card.text}</p> </a>`)} </div> </section> ` })}`;
}, "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/pages/admin/index.astro", void 0);

const $$file = "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/pages/admin/index.astro";
const $$url = "/admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
