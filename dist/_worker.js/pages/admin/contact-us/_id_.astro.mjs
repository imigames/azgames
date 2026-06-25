globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate, h as addAttribute, m as maybeRenderHead } from '../../../chunks/astro/server_jqlxmikg.mjs';
import { $ as $$AdminLayout } from '../../../chunks/AdminLayout_DpMMXuWw.mjs';
import { a as adminUpdateContactMessageStatus, b as adminUpdateContactMessageNote, c as adminGetContactMessageById } from '../../../chunks/contact_DCDPo53Q.mjs';
export { renderers } from '../../../renderers.mjs';

const $$Astro = createAstro("https://freegamezone.io");
const prerender = false;
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  const id = Astro2.params.id ?? "";
  const allowedStatuses = /* @__PURE__ */ new Set(["new", "read", "replied", "archived", "spam"]);
  let actionError = "";
  let actionSuccess = "";
  if (Astro2.request.method === "POST") {
    const formData = await Astro2.request.formData();
    const nextStatus = String(formData.get("status") ?? "");
    const adminNote = String(formData.get("adminNote") ?? "");
    if (allowedStatuses.has(nextStatus)) {
      const result = await adminUpdateContactMessageStatus(id, nextStatus);
      actionSuccess = result.success ? `Message marked as ${nextStatus}.` : "";
      actionError = result.success ? "" : result.error ?? "Unable to update message.";
    } else if (formData.has("adminNote")) {
      const result = await adminUpdateContactMessageNote(id, adminNote);
      actionSuccess = result.success ? "Admin note saved." : "";
      actionError = result.success ? "" : result.error ?? "Unable to save note.";
    }
  }
  const message = await adminGetContactMessageById(id);
  if (!message) {
    return Astro2.redirect("/admin/contact-us");
  }
  if (Astro2.request.method === "GET" && message.status === "new") {
    await adminUpdateContactMessageStatus(id, "read");
    message.status = "read";
  }
  const formatDate = (value) => {
    if (!value) {
      return "-";
    }
    return new Intl.DateTimeFormat("en", {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(new Date(value));
  };
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "View Contact Message | Free Game Zone", "description": "View a Contact Us message." }, { "actions": async ($$result2) => renderTemplate`${maybeRenderHead()}<div class="admin-header-actions"> <a class="admin-link-btn" href="/admin/contact-us">Contact messages</a> <a class="admin-link-btn" href="/admin/">Dashboard</a> </div>`, "default": async ($$result2) => renderTemplate`  <section class="admin-list-page" aria-labelledby="contact-message-title"> <div class="admin-list-heading"> <div> <h1 id="contact-message-title">Contact message</h1> <p>${message.email}</p> </div> </div> ${actionError && renderTemplate`<p class="admin-error">${actionError}</p>`} ${actionSuccess && renderTemplate`<p class="admin-success">${actionSuccess}</p>`} <div class="admin-form-card"> <p><strong>Name:</strong> ${message.name}</p> <p><strong>Email:</strong> <a${addAttribute(`mailto:${message.email}`, "href")}>${message.email}</a></p> <p><strong>Subject:</strong> ${message.subject ?? "-"}</p> <p><strong>Status:</strong> ${message.status}</p> <p><strong>Created:</strong> ${formatDate(message.createdAt)}</p> <p><strong>User agent:</strong> ${message.userAgent ?? "-"}</p> <p><strong>Message:</strong></p> <p>${message.message}</p> </div> <div class="admin-table-actions" aria-label="Message actions"> ${[
    { status: "read", label: "Mark as read" },
    { status: "replied", label: "Mark as replied" },
    { status: "archived", label: "Archive" },
    { status: "spam", label: "Mark spam" }
  ].map((action) => renderTemplate`<form method="post"${addAttribute(Astro2.url.pathname, "action")}> <input type="hidden" name="status"${addAttribute(action.status, "value")}> <button type="submit"${addAttribute(message.status === action.status, "disabled")}>${action.label}</button> </form>`)} </div> <form class="admin-form-card" method="post"${addAttribute(Astro2.url.pathname, "action")}> <label> <span>Admin note</span> <textarea name="adminNote" rows="5">${message.adminNote ?? ""}</textarea> </label> <button class="admin-primary-btn" type="submit">Save note</button> </form> </section> ` })}`;
}, "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/pages/admin/contact-us/[id].astro", void 0);

const $$file = "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/pages/admin/contact-us/[id].astro";
const $$url = "/admin/contact-us/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
