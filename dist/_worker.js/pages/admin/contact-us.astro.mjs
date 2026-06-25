globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate, h as addAttribute, m as maybeRenderHead } from '../../chunks/astro/server_jqlxmikg.mjs';
import { $ as $$AdminLayout } from '../../chunks/AdminLayout_DpMMXuWw.mjs';
import { a as adminUpdateContactMessageStatus, d as adminListContactMessages } from '../../chunks/contact_DCDPo53Q.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://freegamezone.io");
const prerender = false;
const $$ContactUs = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ContactUs;
  const allowedStatuses = /* @__PURE__ */ new Set(["new", "read", "replied", "archived", "spam"]);
  const limit = 40;
  const requestedStatus = Astro2.url.searchParams.get("status")?.trim() ?? "";
  const search = Astro2.url.searchParams.get("search")?.trim() ?? "";
  const requestedPage = Number(Astro2.url.searchParams.get("page") ?? "1");
  const page = Number.isFinite(requestedPage) ? Math.max(1, Math.trunc(requestedPage)) : 1;
  const status = allowedStatuses.has(requestedStatus) ? requestedStatus : "";
  let actionError = "";
  let actionSuccess = "";
  if (Astro2.request.method === "POST") {
    const formData = await Astro2.request.formData();
    const id = String(formData.get("id") ?? "");
    const nextStatus = String(formData.get("status") ?? "");
    if (id && allowedStatuses.has(nextStatus)) {
      const result = await adminUpdateContactMessageStatus(id, nextStatus);
      if (result.success) {
        actionSuccess = `Message marked as ${nextStatus}.`;
      } else {
        actionError = result.error ?? "Unable to update message.";
      }
    }
  }
  const messagesPage = await adminListContactMessages({ status, search, page, limit: limit + 1 });
  const hasNext = messagesPage.length > limit;
  const messages = messagesPage.slice(0, limit);
  const buildPageHref = (pageNumber) => {
    const params = new URLSearchParams();
    if (search) {
      params.set("search", search);
    }
    if (status) {
      params.set("status", status);
    }
    if (pageNumber > 1) {
      params.set("page", String(pageNumber));
    }
    const query = params.toString();
    return query ? `/admin/contact-us?${query}` : "/admin/contact-us";
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
  const previewText = (value) => value.length > 180 ? `${value.slice(0, 180)}...` : value;
  const getActionUrl = () => Astro2.url.pathname + Astro2.url.search;
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Contact messages | Free Game Zone", "description": "Manage Contact Us messages." }, { "actions": async ($$result2) => renderTemplate`${maybeRenderHead()}<div class="admin-header-actions"> <a class="admin-link-btn" href="/admin/">Dashboard</a> <form method="post" action="/admin/"> <input type="hidden" name="intent" value="logout"> <button class="admin-logout-btn" type="submit">Logout</button> </form> </div>`, "default": async ($$result2) => renderTemplate`  <section class="admin-list-page" aria-labelledby="admin-contact-title"> <div class="admin-list-heading"> <div> <h1 id="admin-contact-title">Contact messages</h1> <p>${messages.length} message${messages.length === 1 ? "" : "s"} shown</p> </div> </div> <form class="admin-filter-bar" method="get" action="/admin/contact-us"> <label> <span>Search</span> <input type="search" name="search"${addAttribute(search, "value")} placeholder="Name, email, subject, message"> </label> <label> <span>Status</span> <select name="status"> <option value=""${addAttribute(status === "", "selected")}>All messages</option> <option value="new"${addAttribute(status === "new", "selected")}>New</option> <option value="read"${addAttribute(status === "read", "selected")}>Read</option> <option value="replied"${addAttribute(status === "replied", "selected")}>Replied</option> <option value="archived"${addAttribute(status === "archived", "selected")}>Archived</option> <option value="spam"${addAttribute(status === "spam", "selected")}>Spam</option> </select> </label> <button type="submit">Filter</button> ${(status || search) && renderTemplate`<a class="admin-link-btn" href="/admin/contact-us">Clear</a>`} </form> ${actionError && renderTemplate`<p class="admin-error">${actionError}</p>`} ${actionSuccess && renderTemplate`<p class="admin-success">${actionSuccess}</p>`} <div class="admin-table-wrap"> <table class="admin-table"> <thead> <tr> <th>Name</th> <th>Email</th> <th>Subject</th> <th>Message</th> <th>Status</th> <th>Created</th> <th>Actions</th> </tr> </thead> <tbody> ${messages.length > 0 ? messages.map((message) => renderTemplate`<tr> <td>${message.name}</td> <td><a${addAttribute(`mailto:${message.email}`, "href")}>${message.email}</a></td> <td>${message.subject ?? "-"}</td> <td>${previewText(message.message)}</td> <td>${message.status}</td> <td>${formatDate(message.createdAt)}</td> <td> <div class="admin-table-actions"> <a${addAttribute(`/admin/contact-us/${message.id}`, "href")}>View</a> ${[
    { status: "read", label: "Mark as read" },
    { status: "replied", label: "Mark replied" },
    { status: "archived", label: "Archive" },
    { status: "spam", label: "Mark spam" }
  ].map((action) => renderTemplate`<form method="post"${addAttribute(getActionUrl(), "action")}> <input type="hidden" name="id"${addAttribute(message.id, "value")}> <input type="hidden" name="status"${addAttribute(action.status, "value")}> <button type="submit"${addAttribute(message.status === action.status, "disabled")}> ${action.label} </button> </form>`)} </div> </td> </tr>`) : renderTemplate`<tr> <td colspan="7">No contact messages found.</td> </tr>`} </tbody> </table> </div> <nav class="pagination" aria-label="Contact messages pagination"> <a${addAttribute(["pagination-link", { "is-disabled": page <= 1 }], "class:list")}${addAttribute(buildPageHref(page - 1), "href")}>Previous</a> <span>Page ${page}</span> <a${addAttribute(["pagination-link", { "is-disabled": !hasNext }], "class:list")}${addAttribute(buildPageHref(page + 1), "href")}>Next</a> </nav> </section> ` })}`;
}, "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/pages/admin/contact-us.astro", void 0);

const $$file = "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/pages/admin/contact-us.astro";
const $$url = "/admin/contact-us";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ContactUs,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
