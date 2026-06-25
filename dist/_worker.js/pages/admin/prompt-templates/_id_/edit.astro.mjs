globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../../../chunks/astro/server_jqlxmikg.mjs';
import { $ as $$AdminPromptTemplateForm } from '../../../../chunks/AdminPromptTemplateForm_0Wqu08HZ.mjs';
import { $ as $$AdminLayout } from '../../../../chunks/AdminLayout_DpMMXuWw.mjs';
import { c as adminGetPromptTemplateById, d as adminDeletePromptTemplate, e as adminUpdatePromptTemplate } from '../../../../chunks/prompt-templates_CUEdmw4k.mjs';
export { renderers } from '../../../../renderers.mjs';

const $$Astro = createAstro("https://freegamezone.io");
const prerender = false;
const $$Edit = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Edit;
  const id = Astro2.params.id;
  if (!id) {
    return Astro2.redirect("/admin/prompt-templates");
  }
  const parseVariables = (value) => String(value ?? "").split(/[\n,]/).map((variable) => variable.trim()).filter(Boolean);
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
  let { template, error } = await adminGetPromptTemplateById(id);
  let actionError = error ?? "";
  if (!template) {
    return Astro2.redirect("/admin/prompt-templates");
  }
  if (Astro2.request.method === "POST") {
    const formData = await Astro2.request.formData();
    const intent = String(formData.get("intent") ?? "save");
    if (intent === "deactivate") {
      const result = await adminDeletePromptTemplate(id);
      if (result.success) {
        return Astro2.redirect("/admin/prompt-templates");
      }
      actionError = result.error ?? "Unable to deactivate prompt template.";
    } else {
      const values = toPromptTemplateData(formData);
      const result = await adminUpdatePromptTemplate(id, values);
      if (result.success) {
        return Astro2.redirect("/admin/prompt-templates");
      }
      actionError = result.error ?? "Unable to update prompt template.";
      template = {
        ...template,
        ...values
      };
    }
  }
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": `Edit ${template.name} | Free Game Zone`, "description": "Edit an AI prompt template." }, { "actions": async ($$result2) => renderTemplate`${maybeRenderHead()}<div class="admin-header-actions"> <a class="admin-link-btn" href="/admin/prompt-templates">Prompt Templates</a> </div>`, "default": async ($$result2) => renderTemplate`  <section class="admin-list-page" aria-labelledby="admin-edit-prompt-template-title"> <div class="admin-list-heading"> <div> <h1 id="admin-edit-prompt-template-title">Edit Template</h1> <p>${template.name}</p> </div> </div> ${renderComponent($$result2, "AdminPromptTemplateForm", $$AdminPromptTemplateForm, { "mode": "edit", "values": template, "error": actionError })} </section> ` })}`;
}, "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/pages/admin/prompt-templates/[id]/edit.astro", void 0);

const $$file = "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/pages/admin/prompt-templates/[id]/edit.astro";
const $$url = "/admin/prompt-templates/[id]/edit";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Edit,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
