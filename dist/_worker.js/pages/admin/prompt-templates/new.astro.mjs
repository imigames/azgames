globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../../chunks/astro/server_jqlxmikg.mjs';
import { $ as $$AdminPromptTemplateForm } from '../../../chunks/AdminPromptTemplateForm_0Wqu08HZ.mjs';
import { $ as $$AdminLayout } from '../../../chunks/AdminLayout_DpMMXuWw.mjs';
import { b as adminCreatePromptTemplate } from '../../../chunks/prompt-templates_CUEdmw4k.mjs';
export { renderers } from '../../../renderers.mjs';

const $$Astro = createAstro("https://freegamezone.io");
const prerender = false;
const $$New = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$New;
  const parseVariables = (value) => String(value ?? "").split(/[\n,]/).map((variable) => variable.trim()).filter(Boolean);
  const emptyTemplate = {
    name: "",
    templateKey: "",
    description: "",
    targetType: "game",
    action: "generate_meta_description",
    variables: ["title", "category", "description", "tags"],
    systemPrompt: "",
    userPrompt: "",
    isActive: true
  };
  const toPromptTemplateData = (formData) => ({
    name: String(formData.get("name") ?? ""),
    templateKey: String(formData.get("templateKey") ?? ""),
    description: String(formData.get("description") ?? ""),
    targetType: String(formData.get("targetType") ?? ""),
    action: String(formData.get("action") ?? ""),
    variables: parseVariables(formData.get("variables")),
    systemPrompt: String(formData.get("systemPrompt") ?? ""),
    userPrompt: String(formData.get("userPrompt") ?? ""),
    isActive: formData.has("isActive")
  });
  let values = emptyTemplate;
  let error = "";
  if (Astro2.request.method === "POST") {
    const formData = await Astro2.request.formData();
    values = toPromptTemplateData(formData);
    const result = await adminCreatePromptTemplate(values);
    if (result.success) {
      return Astro2.redirect("/admin/prompt-templates");
    }
    error = result.error ?? "Unable to create prompt template.";
  }
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Add Prompt Template | Free Game Zone", "description": "Create a new AI prompt template." }, { "actions": async ($$result2) => renderTemplate`${maybeRenderHead()}<div class="admin-header-actions"> <a class="admin-link-btn" href="/admin/prompt-templates">Prompt Templates</a> </div>`, "default": async ($$result2) => renderTemplate`  <section class="admin-list-page" aria-labelledby="admin-new-prompt-template-title"> <div class="admin-list-heading"> <div> <h1 id="admin-new-prompt-template-title">Add Template</h1> <p>Create an AI prompt used for SEO generation.</p> </div> </div> ${renderComponent($$result2, "AdminPromptTemplateForm", $$AdminPromptTemplateForm, { "mode": "create", "values": values, "error": error })} </section> ` })}`;
}, "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/pages/admin/prompt-templates/new.astro", void 0);

const $$file = "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/pages/admin/prompt-templates/new.astro";
const $$url = "/admin/prompt-templates/new";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$New,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
