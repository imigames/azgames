globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, f as createComponent, m as maybeRenderHead, h as addAttribute, r as renderTemplate, n as renderScript } from './astro/server_jqlxmikg.mjs';

const $$Astro = createAstro("https://freegamezone.io");
const $$AdminGameForm = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$AdminGameForm;
  const { mode, categories, values, error = "" } = Astro2.props;
  const field = (name) => {
    const value = values[name];
    return value === null || value === void 0 ? "" : String(value);
  };
  const checked = (name) => Boolean(values[name]);
  const articlePlaceholder = `<h2>About this game</h2>
<p>Write your article here...</p>
<h2>How to play</h2>
<ul>
  <li>Use keyboard or mouse controls.</li>
</ul>`;
  return renderTemplate`${maybeRenderHead()}<form class="admin-game-form" method="post" data-admin-game-form${addAttribute(field("id"), "data-game-id")}${addAttribute(field("slug"), "data-game-slug")}> ${error && renderTemplate`<p class="admin-error">${error}</p>`} <div class="admin-form-grid"> <label> <span>Title *</span> <input type="text" name="title"${addAttribute(field("title"), "value")} required> </label> <label> <span>Slug *</span> <input type="text" name="slug"${addAttribute(field("slug"), "value")} placeholder="auto-generated from title"> </label> <label> <span>Category</span> <select name="categorySlug"> <option value="">Uncategorized</option> ${categories.map((category) => renderTemplate`<option${addAttribute(category.slug, "value")}${addAttribute(category.slug === field("categorySlug"), "selected")}> ${category.name} </option>`)} </select> </label> <label> <span>Thumbnail</span> <input type="url" name="thumbnail"${addAttribute(field("thumbnail"), "value")}> </label> <label class="admin-form-wide"> <span>Iframe URL *</span> <input type="url" name="iframeUrl"${addAttribute(field("iframeUrl"), "value")} required> </label> <label> <span>Rating</span> <input type="number" name="rating" min="0" max="5" step="0.1"${addAttribute(field("rating") || "4.5", "value")}> </label> <label> <span>Plays</span> <input type="number" name="plays" min="0" step="1"${addAttribute(field("plays") || "0", "value")}> </label> <label> <span>SEO title</span> <input type="text" name="seoTitle"${addAttribute(field("seoTitle"), "value")}> </label> <label> <span>SEO Description</span> <input type="text" name="seoDescription"${addAttribute(field("seoDescription"), "value")}> <small class="admin-form-help">This is used as the game meta description.</small> </label> <div class="admin-form-wide admin-inline-ai-tools" aria-label="AI tools for game content"> <div> <strong>AI Tools</strong> <small class="admin-form-help">Generate draft content, review it, then save the game when ready.</small> </div> <div class="admin-inline-ai-actions"> <button type="button" data-ai-game-action="generate_article">Generate Article</button> <button type="button" data-ai-game-action="generate_meta_description">Generate Meta Description</button> </div> <p class="admin-ai-inline-message" data-ai-game-message hidden></p> </div> <label class="admin-form-wide"> <span>Article</span> <textarea class="admin-article-textarea" name="description" rows="16"${addAttribute(articlePlaceholder, "placeholder")}>${field("description")}</textarea> <small class="admin-form-help">
HTML is allowed. Use headings, paragraphs, lists, and links to structure the game article.
</small> <div class="admin-form-info-note">
Article supports safe HTML. Use H2/H3 headings, paragraphs, and lists. Do not add scripts,
        iframes, forms, or inline styles. H1 tags will be normalized to H2 on the public game page.
</div> </label> </div> <div class="admin-checkbox-grid"> <label><input type="checkbox" name="isNew"${addAttribute(checked("isNew"), "checked")}> New</label> <label><input type="checkbox" name="isTrending"${addAttribute(checked("isTrending"), "checked")}> Trending</label> <label><input type="checkbox" name="isHot"${addAttribute(checked("isHot"), "checked")}> Hot</label> <label><input type="checkbox" name="isPopular"${addAttribute(checked("isPopular"), "checked")}> Popular</label> <label><input type="checkbox" name="isFeatured"${addAttribute(checked("isFeatured"), "checked")}> Featured</label> <label><input type="checkbox" name="isActive"${addAttribute(checked("isActive"), "checked")}> Active</label> </div> <div class="admin-form-actions"> <button type="submit">${mode === "create" ? "Create Game" : "Save Changes"}</button> <a class="admin-link-btn" href="/admin/games">Cancel</a> </div> </form> ${renderScript($$result, "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/components/admin/AdminGameForm.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/components/admin/AdminGameForm.astro", void 0);

export { $$AdminGameForm as $ };
