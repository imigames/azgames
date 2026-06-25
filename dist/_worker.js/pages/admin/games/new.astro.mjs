globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../../chunks/astro/server_jqlxmikg.mjs';
import { $ as $$AdminGameForm } from '../../../chunks/AdminGameForm_B_HOrkkQ.mjs';
import { $ as $$AdminLayout } from '../../../chunks/AdminLayout_DpMMXuWw.mjs';
import { b as adminCreateGame, a as adminListGameCategories } from '../../../chunks/games-admin_D029h912.mjs';
export { renderers } from '../../../renderers.mjs';

const $$Astro = createAstro("https://freegamezone.io");
const prerender = false;
const $$New = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$New;
  const emptyGame = {
    title: "",
    slug: "",
    categorySlug: "",
    thumbnail: "",
    iframeUrl: "",
    shortDescription: "",
    description: "",
    instructions: "",
    rating: 4.5,
    plays: 0,
    isNew: false,
    isTrending: false,
    isHot: false,
    isPopular: false,
    isFeatured: false,
    isActive: true,
    seoTitle: "",
    seoDescription: ""
  };
  const toGameFormData = (formData) => ({
    title: String(formData.get("title") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    categorySlug: String(formData.get("categorySlug") ?? ""),
    thumbnail: String(formData.get("thumbnail") ?? ""),
    iframeUrl: String(formData.get("iframeUrl") ?? ""),
    shortDescription: "",
    description: String(formData.get("description") ?? ""),
    instructions: "",
    rating: Number(formData.get("rating") ?? 4.5),
    plays: Number(formData.get("plays") ?? 0),
    isNew: formData.has("isNew"),
    isTrending: formData.has("isTrending"),
    isHot: formData.has("isHot"),
    isPopular: formData.has("isPopular"),
    isFeatured: formData.has("isFeatured"),
    isActive: formData.has("isActive"),
    seoTitle: String(formData.get("seoTitle") ?? ""),
    seoDescription: String(formData.get("seoDescription") ?? "")
  });
  let values = emptyGame;
  let error = "";
  if (Astro2.request.method === "POST") {
    values = toGameFormData(await Astro2.request.formData());
    const result = await adminCreateGame(values);
    if (result.success) {
      return Astro2.redirect("/admin/games");
    }
    error = result.error ?? "Unable to create game.";
  }
  const categories = await adminListGameCategories();
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Add New Game | Free Game Zone", "description": "Create a new game." }, { "actions": async ($$result2) => renderTemplate`${maybeRenderHead()}<div class="admin-header-actions"> <a class="admin-link-btn" href="/admin/games">Games</a> </div>`, "default": async ($$result2) => renderTemplate`  <section class="admin-list-page" aria-labelledby="admin-new-game-title"> <div class="admin-list-heading"> <div> <h1 id="admin-new-game-title">Add New Game</h1> <p>Create a browser game record.</p> </div> </div> ${renderComponent($$result2, "AdminGameForm", $$AdminGameForm, { "mode": "create", "categories": categories, "values": values, "error": error })} </section> ` })}`;
}, "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/pages/admin/games/new.astro", void 0);

const $$file = "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/pages/admin/games/new.astro";
const $$url = "/admin/games/new";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$New,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
