globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate, h as addAttribute, n as renderScript, m as maybeRenderHead } from '../../../../chunks/astro/server_jqlxmikg.mjs';
import { $ as $$AdminCategoryForm } from '../../../../chunks/AdminCategoryForm_BdqGU4ay.mjs';
import { $ as $$AdminLayout } from '../../../../chunks/AdminLayout_DpMMXuWw.mjs';
import { g as generateAiText } from '../../../../chunks/ai-client_GU1hroY7.mjs';
import { b as adminCreateGenerationLog } from '../../../../chunks/ai-providers_Dsks5SxJ.mjs';
import { a as adminGetPromptTemplateByKey, r as renderPromptTemplate } from '../../../../chunks/prompt-templates_CUEdmw4k.mjs';
import { b as adminGetCategoryById, c as adminUpdateCategory } from '../../../../chunks/categories-admin_C6UJweNw.mjs';
export { renderers } from '../../../../renderers.mjs';

const $$Astro = createAstro("https://freegamezone.io");
const prerender = false;
const $$Edit = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Edit;
  const id = Astro2.params.id;
  if (!id) {
    return Astro2.redirect("/admin/categories");
  }
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
  let category = await adminGetCategoryById(id);
  let error = "";
  let aiError = "";
  let aiResult = null;
  if (!category) {
    return Astro2.redirect("/admin/categories");
  }
  const categoryVariables = () => ({
    categoryName: category.name,
    categorySlug: category.slug,
    category: category.name,
    currentDescription: category.description,
    description: category.description,
    seoTitle: category.seoTitle,
    seoDescription: category.seoDescription
  });
  const promptTemplateError = "Prompt template is missing or inactive. Please check Prompt Templates.";
  const formatPromptForLog = (systemPrompt, userPrompt) => systemPrompt ? `System prompt:
${systemPrompt}

User prompt:
${userPrompt}` : userPrompt;
  const logCategoryGeneration = async ({
    action,
    prompt,
    result,
    status,
    errorMessage,
    providerKey,
    model
  }) => adminCreateGenerationLog({
    providerKey,
    model,
    targetType: "category",
    targetId: category.id,
    targetSlug: category.slug,
    action,
    prompt,
    result,
    status,
    errorMessage
  });
  const generateCategoryDescription = async () => {
    const { template, error: templateError } = await adminGetPromptTemplateByKey("category_description");
    const action = "generate_category_description";
    if (templateError || !template) {
      aiError = promptTemplateError;
      await logCategoryGeneration({ action, status: "error", errorMessage: aiError });
      return;
    }
    const renderedPrompt = renderPromptTemplate(template, categoryVariables());
    try {
      const generated = await generateAiText({
        system: renderedPrompt.systemPrompt,
        prompt: renderedPrompt.userPrompt,
        maxTokens: 800,
        temperature: 0.65
      });
      await logCategoryGeneration({
        action,
        prompt: formatPromptForLog(renderedPrompt.systemPrompt, renderedPrompt.userPrompt),
        result: generated.text,
        status: "success",
        providerKey: generated.providerKey,
        model: generated.model
      });
      aiResult = {
        title: "Generated Category Description",
        text: generated.text,
        applyTarget: "description"
      };
    } catch (generationError) {
      aiError = generationError instanceof Error ? generationError.message : "AI generation failed.";
      await logCategoryGeneration({
        action,
        prompt: formatPromptForLog(renderedPrompt.systemPrompt, renderedPrompt.userPrompt),
        status: "error",
        errorMessage: aiError
      });
    }
  };
  const generateCategorySeoField = async (action) => {
    const isTitle = action === "generate_category_seo_title";
    const templateKey = isTitle ? "category_seo_title" : "category_meta_description";
    const { template, error: templateError } = await adminGetPromptTemplateByKey(templateKey);
    if (templateError || !template) {
      aiError = promptTemplateError;
      await logCategoryGeneration({ action, status: "error", errorMessage: aiError });
      return;
    }
    const renderedPrompt = renderPromptTemplate(template, categoryVariables());
    try {
      const generated = await generateAiText({
        system: renderedPrompt.systemPrompt,
        prompt: renderedPrompt.userPrompt,
        maxTokens: isTitle ? 120 : 220,
        temperature: 0.6
      });
      await logCategoryGeneration({
        action,
        prompt: formatPromptForLog(renderedPrompt.systemPrompt, renderedPrompt.userPrompt),
        result: generated.text,
        status: "success",
        providerKey: generated.providerKey,
        model: generated.model
      });
      aiResult = {
        title: isTitle ? "Generated SEO Title" : "Generated SEO Description",
        text: generated.text,
        applyTarget: isTitle ? "seoTitle" : "seoDescription"
      };
    } catch (generationError) {
      aiError = generationError instanceof Error ? generationError.message : "AI generation failed.";
      await logCategoryGeneration({
        action,
        prompt: formatPromptForLog(renderedPrompt.systemPrompt, renderedPrompt.userPrompt),
        status: "error",
        errorMessage: aiError
      });
    }
  };
  if (Astro2.request.method === "POST") {
    const formData = await Astro2.request.formData();
    const action = String(formData.get("adminAction") ?? "save");
    if (action === "generate_category_description") {
      await generateCategoryDescription();
    } else if (action === "generate_category_seo_title") {
      await generateCategorySeoField("generate_category_seo_title");
    } else if (action === "generate_category_seo_description") {
      await generateCategorySeoField("generate_category_seo_description");
    } else {
      const values = toCategoryFormData(formData);
      const result = await adminUpdateCategory(id, values);
      if (result.success) {
        return Astro2.redirect("/admin/categories");
      }
      error = result.error ?? "Unable to update category.";
      category = {
        ...category,
        ...values
      };
    }
  }
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": `Edit ${category.name} | Free Game Zone`, "description": "Edit category details." }, { "actions": async ($$result2) => renderTemplate`${maybeRenderHead()}<div class="admin-header-actions"> <a class="admin-link-btn" href="/admin/categories">Categories</a> <a class="admin-link-btn"${addAttribute(`/category/${category.slug.endsWith("-games") ? category.slug : `${category.slug}-games`}/`, "href")}>View</a> </div>`, "default": async ($$result2) => renderTemplate`  <section class="admin-list-page" aria-labelledby="admin-edit-category-title"> <div class="admin-list-heading"> <div> <h1 id="admin-edit-category-title">Edit Category</h1> <p>${category.name}</p> </div> </div> <section class="admin-form-card admin-ai-tools-card" aria-labelledby="admin-category-ai-tools-title"> <div class="admin-ai-tools-heading"> <div> <h2 id="admin-category-ai-tools-title">AI Tools</h2> <p>Generate category SEO content on the server, review it, then apply it to the form.</p> </div> </div> ${aiError && renderTemplate`<p class="admin-error">${aiError}</p>`} <div class="admin-form-actions"> <form method="post"${addAttribute(Astro2.url.pathname, "action")}> <input type="hidden" name="adminAction" value="generate_category_description"> <button type="submit">Generate Category Description</button> </form> <form method="post"${addAttribute(Astro2.url.pathname, "action")}> <input type="hidden" name="adminAction" value="generate_category_seo_title"> <button type="submit">Generate SEO Title</button> </form> <form method="post"${addAttribute(Astro2.url.pathname, "action")}> <input type="hidden" name="adminAction" value="generate_category_seo_description"> <button type="submit">Generate SEO Description</button> </form> </div> ${aiResult && renderTemplate`<div class="admin-ai-result" data-ai-result-wrap> <div class="admin-ai-result-heading"> <strong>${aiResult.title}</strong> <button type="button"${addAttribute(aiResult.applyTarget, "data-ai-apply")}${addAttribute(`Apply ${aiResult.title}`, "aria-label")}> ${aiResult.applyTarget === "description" ? "Apply to Description" : aiResult.applyTarget === "seoTitle" ? "Apply to SEO Title" : "Apply to SEO Description"} </button> </div> <textarea readonly${addAttribute(aiResult.applyTarget === "description" ? "10" : "4", "rows")} data-ai-result>              ${aiResult.text}
            </textarea> </div>`} </section> ${renderComponent($$result2, "AdminCategoryForm", $$AdminCategoryForm, { "mode": "edit", "values": category, "error": error })} </section> ${renderScript($$result2, "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/pages/admin/categories/[id]/edit.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/pages/admin/categories/[id]/edit.astro", void 0);

const $$file = "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/pages/admin/categories/[id]/edit.astro";
const $$url = "/admin/categories/[id]/edit";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Edit,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
