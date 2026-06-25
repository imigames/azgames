globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, f as createComponent, m as maybeRenderHead, r as renderTemplate, h as addAttribute } from './astro/server_jqlxmikg.mjs';

const $$Astro = createAstro("https://freegamezone.io");
const $$AdminCategoryForm = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$AdminCategoryForm;
  const { mode, values, error = "" } = Astro2.props;
  const field = (name) => {
    const value = values[name];
    return value === null || value === void 0 ? "" : String(value);
  };
  const checked = (name) => Boolean(values[name]);
  return renderTemplate`${maybeRenderHead()}<form class="admin-game-form" method="post"> ${error && renderTemplate`<p class="admin-error">${error}</p>`} <div class="admin-form-grid"> <label> <span>Name *</span> <input type="text" name="name"${addAttribute(field("name"), "value")} required> </label> <label> <span>Slug *</span> <input type="text" name="slug"${addAttribute(field("slug"), "value")} placeholder="auto-generated from name"> </label> <label> <span>Icon</span> <input type="text" name="icon"${addAttribute(field("icon"), "value")}> </label> <label> <span>Sort order</span> <input type="number" name="sortOrder" step="1"${addAttribute(field("sortOrder") || "0", "value")}> </label> <label class="admin-form-wide"> <span>Image</span> <input type="url" name="image"${addAttribute(field("image"), "value")}> </label> <label> <span>SEO title</span> <input type="text" name="seoTitle"${addAttribute(field("seoTitle"), "value")}> </label> <label> <span>SEO description</span> <input type="text" name="seoDescription"${addAttribute(field("seoDescription"), "value")}> </label> <label class="admin-form-wide"> <span>Description</span> <textarea name="description" rows="5">${field("description")}</textarea> </label> </div> <div class="admin-checkbox-grid"> <label><input type="checkbox" name="isActive"${addAttribute(checked("isActive"), "checked")}> Active</label> </div> <div class="admin-form-actions"> <button type="submit">${mode === "create" ? "Create Category" : "Save Changes"}</button> <a class="admin-link-btn" href="/admin/categories">Cancel</a> </div> </form>`;
}, "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/components/admin/AdminCategoryForm.astro", void 0);

export { $$AdminCategoryForm as $ };
