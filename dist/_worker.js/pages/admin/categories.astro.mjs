globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate, h as addAttribute, m as maybeRenderHead } from '../../chunks/astro/server_jqlxmikg.mjs';
import { $ as $$AdminLayout } from '../../chunks/AdminLayout_DpMMXuWw.mjs';
import { d as adminDeactivateCategory, e as adminListCategories } from '../../chunks/categories-admin_C6UJweNw.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://freegamezone.io");
const prerender = false;
const $$Categories = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Categories;
  let actionError = "";
  let actionSuccess = "";
  if (Astro2.request.method === "POST") {
    const formData = await Astro2.request.formData();
    const intent = String(formData.get("intent") ?? "");
    const id = String(formData.get("id") ?? "");
    if (intent === "deactivate" && id) {
      const result = await adminDeactivateCategory(id);
      if (result.success) {
        actionSuccess = "Category deactivated.";
      } else {
        actionError = result.error ?? "Unable to deactivate category.";
      }
    }
  }
  const { categories, error } = await adminListCategories();
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Admin Categories | Free Game Zone", "description": "Manage categories in the Free Game Zone admin area." }, { "actions": async ($$result2) => renderTemplate`${maybeRenderHead()}<div class="admin-header-actions"> <a class="admin-link-btn" href="/admin/">Dashboard</a> <a class="admin-primary-btn" href="/admin/categories/new">Add Category</a> <form method="post" action="/admin/"> <input type="hidden" name="intent" value="logout"> <button class="admin-logout-btn" type="submit">Logout</button> </form> </div>`, "default": async ($$result2) => renderTemplate`  <section class="admin-list-page" aria-labelledby="admin-categories-title"> <div class="admin-list-heading"> <div> <h1 id="admin-categories-title">Categories</h1> <p>${categories.length} categor${categories.length === 1 ? "y" : "ies"} found</p> </div> </div> ${error && renderTemplate`<p class="admin-error">${error}</p>`} ${actionError && renderTemplate`<p class="admin-error">${actionError}</p>`} ${actionSuccess && renderTemplate`<p class="admin-success">${actionSuccess}</p>`} <div class="admin-table-wrap"> <table class="admin-table"> <thead> <tr> <th>Name</th> <th>Slug</th> <th>Icon</th> <th>Sort</th> <th>Active</th> <th>SEO title</th> <th>Actions</th> </tr> </thead> <tbody> ${categories.length > 0 ? categories.map((category) => renderTemplate`<tr> <td>${category.name}</td> <td><code>${category.slug}</code></td> <td>${category.icon ?? "-"}</td> <td>${category.sortOrder}</td> <td>${category.isActive ? "Yes" : "No"}</td> <td>${category.seoTitle ?? "-"}</td> <td> <div class="admin-table-actions"> <a${addAttribute(`/admin/categories/${category.id}/edit`, "href")}>Edit</a> <a${addAttribute(`/category/${category.slug.endsWith("-games") ? category.slug : `${category.slug}-games`}/`, "href")}>View</a> <form method="post" action="/admin/categories"> <input type="hidden" name="intent" value="deactivate"> <input type="hidden" name="id"${addAttribute(category.id, "value")}> <button type="submit"${addAttribute(!category.isActive, "disabled")}>Deactivate</button> </form> </div> </td> </tr>`) : renderTemplate`<tr> <td colspan="7">No categories found.</td> </tr>`} </tbody> </table> </div> </section> ` })}`;
}, "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/pages/admin/categories.astro", void 0);

const $$file = "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/pages/admin/categories.astro";
const $$url = "/admin/categories";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Categories,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
