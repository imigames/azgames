globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../../chunks/astro/server_jqlxmikg.mjs';
import { $ as $$AdminCategoryForm } from '../../../chunks/AdminCategoryForm_BdqGU4ay.mjs';
import { $ as $$AdminLayout } from '../../../chunks/AdminLayout_DpMMXuWw.mjs';
import { a as adminCreateCategory } from '../../../chunks/categories-admin_C6UJweNw.mjs';
export { renderers } from '../../../renderers.mjs';

const $$Astro = createAstro("https://freegamezone.io");
const prerender = false;
const $$New = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$New;
  const emptyCategory = {
    name: "",
    slug: "",
    description: "",
    icon: "",
    image: "",
    seoTitle: "",
    seoDescription: "",
    sortOrder: 0,
    isActive: true
  };
  const toCategoryFormData = (formData) => ({
    name: String(formData.get("name") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    description: String(formData.get("description") ?? ""),
    icon: String(formData.get("icon") ?? ""),
    image: String(formData.get("image") ?? ""),
    seoTitle: String(formData.get("seoTitle") ?? ""),
    seoDescription: String(formData.get("seoDescription") ?? ""),
    sortOrder: Number(formData.get("sortOrder") ?? 0),
    isActive: formData.has("isActive")
  });
  let values = emptyCategory;
  let error = "";
  if (Astro2.request.method === "POST") {
    values = toCategoryFormData(await Astro2.request.formData());
    const result = await adminCreateCategory(values);
    if (result.success) {
      return Astro2.redirect("/admin/categories");
    }
    error = result.error ?? "Unable to create category.";
  }
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Add Category | Free Game Zone", "description": "Create a new category." }, { "actions": async ($$result2) => renderTemplate`${maybeRenderHead()}<div class="admin-header-actions"> <a class="admin-link-btn" href="/admin/categories">Categories</a> </div>`, "default": async ($$result2) => renderTemplate`  <section class="admin-list-page" aria-labelledby="admin-new-category-title"> <div class="admin-list-heading"> <div> <h1 id="admin-new-category-title">Add Category</h1> <p>Create a browser games category.</p> </div> </div> ${renderComponent($$result2, "AdminCategoryForm", $$AdminCategoryForm, { "mode": "create", "values": values, "error": error })} </section> ` })}`;
}, "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/pages/admin/categories/new.astro", void 0);

const $$file = "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/pages/admin/categories/new.astro";
const $$url = "/admin/categories/new";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$New,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
