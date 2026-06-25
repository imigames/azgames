globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate, h as addAttribute, m as maybeRenderHead } from '../../chunks/astro/server_jqlxmikg.mjs';
import { $ as $$AdminLayout } from '../../chunks/AdminLayout_DpMMXuWw.mjs';
import { d as adminDeletePromptTemplate, c as adminGetPromptTemplateById, b as adminCreatePromptTemplate, f as adminListPromptTemplates, a as adminGetPromptTemplateByKey } from '../../chunks/prompt-templates_CUEdmw4k.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://freegamezone.io");
const prerender = false;
const $$PromptTemplates = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$PromptTemplates;
  const limit = 40;
  const targetTypes = ["game", "category"];
  const actions = [
    "generate_meta_description",
    "generate_article",
    "generate_description",
    "generate_seo_title"
  ];
  let actionError = "";
  let actionSuccess = "";
  const getDuplicateTemplateKey = async (templateKey) => {
    const baseKey = `${templateKey}_copy`;
    const baseResult = await adminGetPromptTemplateByKey(baseKey, { includeInactive: true });
    if (!baseResult.template) {
      return baseKey;
    }
    for (let index = 2; index < 100; index += 1) {
      const candidateKey = `${baseKey}_${index}`;
      const candidateResult = await adminGetPromptTemplateByKey(candidateKey, { includeInactive: true });
      if (!candidateResult.template) {
        return candidateKey;
      }
    }
    return `${baseKey}_${Date.now().toString(36)}`;
  };
  if (Astro2.request.method === "POST") {
    const formData = await Astro2.request.formData();
    const intent = String(formData.get("intent") ?? "");
    const id = String(formData.get("id") ?? "");
    if (intent === "deactivate" && id) {
      const result = await adminDeletePromptTemplate(id);
      if (result.success) {
        actionSuccess = "Prompt template deactivated.";
      } else {
        actionError = result.error ?? "Unable to deactivate prompt template.";
      }
    }
    if (intent === "duplicate" && id) {
      const { template, error: error2 } = await adminGetPromptTemplateById(id);
      if (error2 || !template) {
        actionError = error2 ?? "Prompt template not found.";
      } else {
        const copyKey = await getDuplicateTemplateKey(template.templateKey);
        const result = await adminCreatePromptTemplate({
          templateKey: copyKey,
          name: `${template.name} Copy`,
          description: template.description ?? "",
          targetType: template.targetType ?? "",
          action: template.action ?? "",
          variables: template.variables,
          systemPrompt: template.systemPrompt ?? "",
          userPrompt: template.userPrompt,
          isActive: false
        });
        if (result.success) {
          actionSuccess = "Prompt template duplicated as inactive copy.";
        } else {
          actionError = result.error ?? "Unable to duplicate prompt template.";
        }
      }
    }
  }
  const search = Astro2.url.searchParams.get("search")?.trim() ?? "";
  const targetType = Astro2.url.searchParams.get("target_type")?.trim() ?? "";
  const action = Astro2.url.searchParams.get("action")?.trim() ?? "";
  const requestedPage = Number(Astro2.url.searchParams.get("page") ?? "1");
  const page = Number.isFinite(requestedPage) ? Math.max(1, Math.trunc(requestedPage)) : 1;
  const { templates, total, hasNext, error } = await adminListPromptTemplates({
    search,
    targetType,
    action,
    page,
    limit
  });
  const formatDate = (value) => value ? new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value)) : "-";
  const buildPageHref = (pageNumber) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (targetType) params.set("target_type", targetType);
    if (action) params.set("action", action);
    if (pageNumber > 1) params.set("page", String(pageNumber));
    const query = params.toString();
    return query ? `/admin/prompt-templates?${query}` : "/admin/prompt-templates";
  };
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Prompt Templates | Free Game Zone", "description": "Manage AI prompts used to generate SEO content for games and categories." }, { "actions": async ($$result2) => renderTemplate`${maybeRenderHead()}<div class="admin-header-actions"> <a class="admin-primary-btn" href="/admin/prompt-templates/new">Add Template</a> </div>`, "default": async ($$result2) => renderTemplate`  <section class="admin-list-page" aria-labelledby="admin-prompt-templates-title"> <div class="admin-list-heading"> <div> <h1 id="admin-prompt-templates-title">Prompt Templates</h1> <p>${total} template${total === 1 ? "" : "s"} found</p> </div> </div> <form class="admin-filter-bar" method="get" action="/admin/prompt-templates"> <label> <span>Search</span> <input type="search" name="search"${addAttribute(search, "value")} placeholder="Name, key, or description"> </label> <label> <span>Target type</span> <select name="target_type"> <option value="">All</option> ${targetTypes.map((type) => renderTemplate`<option${addAttribute(type, "value")}${addAttribute(type === targetType, "selected")}>${type}</option>`)} </select> </label> <label> <span>Action</span> <select name="action"> <option value="">All</option> ${actions.map((item) => renderTemplate`<option${addAttribute(item, "value")}${addAttribute(item === action, "selected")}>${item}</option>`)} </select> </label> <button type="submit">Filter</button> ${(search || targetType || action) && renderTemplate`<a class="admin-link-btn" href="/admin/prompt-templates">Clear</a>`} </form> ${error && renderTemplate`<p class="admin-error">${error}</p>`} ${actionError && renderTemplate`<p class="admin-error">${actionError}</p>`} ${actionSuccess && renderTemplate`<p class="admin-success">${actionSuccess}</p>`} <div class="admin-table-wrap"> <table class="admin-table admin-prompt-templates-table"> <thead> <tr> <th>Name</th> <th>Template key</th> <th>Target</th> <th>Action</th> <th>Status</th> <th>Updated</th> <th>Actions</th> </tr> </thead> <tbody> ${templates.length > 0 ? templates.map((template) => renderTemplate`<tr> <td>${template.name}</td> <td><code>${template.templateKey}</code></td> <td>${template.targetType ?? "-"}</td> <td class="admin-text-compact">${template.action ?? "-"}</td> <td> <span${addAttribute(["admin-status-badge", template.isActive ? "is-ok" : "is-muted"], "class:list")}> ${template.isActive ? "Active" : "Inactive"} </span> </td> <td>${formatDate(template.updatedAt ?? template.createdAt)}</td> <td> <div class="admin-table-actions"> <a${addAttribute(`/admin/prompt-templates/${template.id}/edit`, "href")}>Edit</a> <form method="post"${addAttribute(Astro2.url.pathname + Astro2.url.search, "action")}> <input type="hidden" name="intent" value="duplicate"> <input type="hidden" name="id"${addAttribute(template.id, "value")}> <button type="submit">Duplicate</button> </form> <form method="post"${addAttribute(Astro2.url.pathname + Astro2.url.search, "action")}> <input type="hidden" name="intent" value="deactivate"> <input type="hidden" name="id"${addAttribute(template.id, "value")}> <button type="submit"${addAttribute(!template.isActive, "disabled")}>Deactivate</button> </form> </div> </td> </tr>`) : renderTemplate`<tr> <td colspan="7">No prompt templates found.</td> </tr>`} </tbody> </table> </div> <nav class="pagination" aria-label="Prompt templates pagination"> ${page > 1 ? renderTemplate`<a class="pagination-link"${addAttribute(buildPageHref(page - 1), "href")}>Previous</a>` : renderTemplate`<span class="pagination-link pagination-link--disabled" aria-disabled="true">Previous</span>`} <span class="pagination-current">Page ${page}</span> ${hasNext ? renderTemplate`<a class="pagination-link"${addAttribute(buildPageHref(page + 1), "href")}>Next</a>` : renderTemplate`<span class="pagination-link pagination-link--disabled" aria-disabled="true">Next</span>`} </nav> </section> ` })}`;
}, "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/pages/admin/prompt-templates.astro", void 0);

const $$file = "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/pages/admin/prompt-templates.astro";
const $$url = "/admin/prompt-templates";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$PromptTemplates,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
