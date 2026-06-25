globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate, h as addAttribute, m as maybeRenderHead } from '../../chunks/astro/server_jqlxmikg.mjs';
import { $ as $$AdminLayout } from '../../chunks/AdminLayout_DpMMXuWw.mjs';
import { a as adminDeleteComment, b as adminUpdateCommentStatus, c as adminListComments } from '../../chunks/comments_DOZvQxwy.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://freegamezone.io");
const prerender = false;
const $$Comments = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Comments;
  const allowedStatuses = /* @__PURE__ */ new Set(["pending", "approved", "spam", "deleted"]);
  const requestedStatus = Astro2.url.searchParams.get("status")?.trim() ?? "";
  const status = allowedStatuses.has(requestedStatus) ? requestedStatus : "";
  let actionError = "";
  let actionSuccess = "";
  if (Astro2.request.method === "POST") {
    const formData = await Astro2.request.formData();
    const id = String(formData.get("id") ?? "");
    const action = String(formData.get("action") ?? "");
    const nextStatus = String(formData.get("status") ?? "");
    if (id && action === "delete") {
      const result = await adminDeleteComment(id);
      if (result.success) {
        actionSuccess = "Comment marked as deleted.";
      } else {
        actionError = result.error ?? "Unable to delete comment.";
      }
    } else if (id && allowedStatuses.has(nextStatus)) {
      const result = await adminUpdateCommentStatus(id, nextStatus);
      if (result.success) {
        actionSuccess = `Comment marked as ${nextStatus}.`;
      } else {
        actionError = result.error ?? "Unable to update comment.";
      }
    }
  }
  const comments = await adminListComments({ status, page: 1, limit: 100 });
  const formatDate = (value) => {
    if (!value) {
      return "-";
    }
    return new Intl.DateTimeFormat("en", {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(new Date(value));
  };
  const getActionUrl = () => Astro2.url.pathname + Astro2.url.search;
  const previewComment = (value) => value.length > 180 ? `${value.slice(0, 180)}...` : value;
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Admin Comments | Free Game Zone", "description": "Moderate player game comments." }, { "actions": async ($$result2) => renderTemplate`${maybeRenderHead()}<div class="admin-header-actions"> <a class="admin-link-btn" href="/admin/">Dashboard</a> <form method="post" action="/admin/"> <input type="hidden" name="intent" value="logout"> <button class="admin-logout-btn" type="submit">Logout</button> </form> </div>`, "default": async ($$result2) => renderTemplate`  <section class="admin-list-page" aria-labelledby="admin-comments-title"> <div class="admin-list-heading"> <div> <h1 id="admin-comments-title">Comments</h1> <p>${comments.length} comment${comments.length === 1 ? "" : "s"} found</p> </div> </div> <form class="admin-filter-bar" method="get" action="/admin/comments"> <label> <span>Status</span> <select name="status"> <option value=""${addAttribute(status === "", "selected")}>All comments</option> <option value="pending"${addAttribute(status === "pending", "selected")}>Pending</option> <option value="approved"${addAttribute(status === "approved", "selected")}>Approved</option> <option value="spam"${addAttribute(status === "spam", "selected")}>Spam</option> <option value="deleted"${addAttribute(status === "deleted", "selected")}>Deleted</option> </select> </label> <button type="submit">Filter</button> ${status && renderTemplate`<a class="admin-link-btn" href="/admin/comments">Clear</a>`} </form> ${actionError && renderTemplate`<p class="admin-error">${actionError}</p>`} ${actionSuccess && renderTemplate`<p class="admin-success">${actionSuccess}</p>`} <div class="admin-table-wrap"> <table class="admin-table"> <thead> <tr> <th>Game slug</th> <th>Name</th> <th>Comment</th> <th>Status</th> <th>Created</th> <th>Actions</th> </tr> </thead> <tbody> ${comments.length > 0 ? comments.map((comment) => renderTemplate`<tr> <td> <a${addAttribute(`/game/${comment.gameSlug}/`, "href")}> <code>${comment.gameSlug}</code> </a> </td> <td>${comment.name}</td> <td>${previewComment(comment.comment)}</td> <td>${comment.status}</td> <td>${formatDate(comment.createdAt)}</td> <td> <div class="admin-table-actions"> <form method="post"${addAttribute(getActionUrl(), "action")}> <input type="hidden" name="id"${addAttribute(comment.id, "value")}> <input type="hidden" name="status" value="approved"> <button type="submit"${addAttribute(comment.status === "approved", "disabled")}>Approve</button> </form> <form method="post"${addAttribute(getActionUrl(), "action")}> <input type="hidden" name="id"${addAttribute(comment.id, "value")}> <input type="hidden" name="status" value="pending"> <button type="submit"${addAttribute(comment.status === "pending", "disabled")}>Pending</button> </form> <form method="post"${addAttribute(getActionUrl(), "action")}> <input type="hidden" name="id"${addAttribute(comment.id, "value")}> <input type="hidden" name="status" value="spam"> <button type="submit"${addAttribute(comment.status === "spam", "disabled")}>Spam</button> </form> <form method="post"${addAttribute(getActionUrl(), "action")}> <input type="hidden" name="id"${addAttribute(comment.id, "value")}> <input type="hidden" name="action" value="delete"> <button type="submit"${addAttribute(comment.status === "deleted", "disabled")}>Delete</button> </form> </div> </td> </tr>`) : renderTemplate`<tr> <td colspan="6">No comments found.</td> </tr>`} </tbody> </table> </div> </section> ` })}`;
}, "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/pages/admin/comments.astro", void 0);

const $$file = "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/pages/admin/comments.astro";
const $$url = "/admin/comments";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Comments,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
