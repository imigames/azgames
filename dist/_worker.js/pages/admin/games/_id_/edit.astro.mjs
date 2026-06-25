globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../../../../chunks/astro/server_jqlxmikg.mjs';
import { $ as $$AdminGameForm } from '../../../../chunks/AdminGameForm_B_HOrkkQ.mjs';
import { $ as $$AdminLayout } from '../../../../chunks/AdminLayout_DpMMXuWw.mjs';
import { c as adminGetGameById, a as adminListGameCategories, d as adminUpdateGame } from '../../../../chunks/games-admin_D029h912.mjs';
export { renderers } from '../../../../renderers.mjs';

const $$Astro = createAstro("https://freegamezone.io");
const prerender = false;
const $$Edit = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Edit;
  const id = Astro2.params.id;
  if (!id) {
    return Astro2.redirect("/admin/games");
  }
  const toGameFormData = (formData, existingGame) => ({
    title: String(formData.get("title") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    categorySlug: String(formData.get("categorySlug") ?? ""),
    thumbnail: String(formData.get("thumbnail") ?? ""),
    iframeUrl: String(formData.get("iframeUrl") ?? ""),
    shortDescription: existingGame.shortDescription ?? "",
    description: String(formData.get("description") ?? ""),
    instructions: existingGame.instructions ?? "",
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
  let game = await adminGetGameById(id);
  let error = "";
  if (!game) {
    return Astro2.redirect("/admin/games");
  }
  const categories = await adminListGameCategories();
  if (Astro2.request.method === "POST") {
    const formData = await Astro2.request.formData();
    const values = toGameFormData(formData, game);
    const result = await adminUpdateGame(id, values);
    if (result.success) {
      return Astro2.redirect("/admin/games");
    }
    error = result.error ?? "Unable to update game.";
    game = {
      ...game,
      ...values
    };
  }
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": `Edit ${game.title} | Free Game Zone`, "description": "Edit game details." }, { "actions": async ($$result2) => renderTemplate`${maybeRenderHead()}<div class="admin-header-actions"> <a class="admin-link-btn" href="/admin/games">Games</a> <a class="admin-link-btn"${addAttribute(`/game/${game.slug}/`, "href")}>View</a> </div>`, "default": async ($$result2) => renderTemplate`  <section class="admin-list-page" aria-labelledby="admin-edit-game-title"> <div class="admin-list-heading"> <div> <h1 id="admin-edit-game-title">Edit Game</h1> <p>${game.title}</p> </div> </div> ${renderComponent($$result2, "AdminGameForm", $$AdminGameForm, { "mode": "edit", "categories": categories, "values": game, "error": error })} </section> ` })}`;
}, "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/pages/admin/games/[id]/edit.astro", void 0);

const $$file = "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/pages/admin/games/[id]/edit.astro";
const $$url = "/admin/games/[id]/edit";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Edit,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
