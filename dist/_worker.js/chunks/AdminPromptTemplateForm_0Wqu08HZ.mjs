globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, f as createComponent, m as maybeRenderHead, r as renderTemplate, h as addAttribute, n as renderScript } from './astro/server_jqlxmikg.mjs';

const $$Astro = createAstro("https://freegamezone.io");
const $$AdminPromptTemplateForm = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$AdminPromptTemplateForm;
  const { mode, values, error = "" } = Astro2.props;
  const targetTypes = ["game", "category"];
  const actions = [
    "generate_meta_description",
    "generate_article",
    "generate_description",
    "generate_seo_title",
    "generate_short_description"
  ];
  const field = (name) => {
    const value = values[name];
    return value === null || value === void 0 ? "" : String(value);
  };
  const checked = (name) => Boolean(values[name]);
  const variables = Array.isArray(values.variables) ? values.variables.join(", ") : "";
  const gameSampleVariables = `{
  "title": "Poxel io",
  "category": "Io Games",
  "description": "Play Poxel io online for free.",
  "instructions": "Use keyboard and mouse to play.",
  "tags": ["io", "shooting", "browser game"]
}`;
  const categorySampleVariables = `{
  "categoryName": "Shooting Games",
  "categorySlug": "shooting-games",
  "currentDescription": "Play free shooting games online."
}`;
  const defaultSampleVariables = field("targetType") === "category" ? categorySampleVariables : gameSampleVariables;
  return renderTemplate`${maybeRenderHead()}<form class="admin-game-form admin-prompt-template-form" method="post"> ${error && renderTemplate`<p class="admin-error">${error}</p>`} <section class="admin-settings-section" aria-labelledby="prompt-template-basic-title"> <div class="admin-settings-section-heading"> <h2 id="prompt-template-basic-title">Template details</h2> <p>Use lowercase template keys and choose where this prompt is used.</p> </div> <div class="admin-form-grid"> <label> <span>Name *</span> <input type="text" name="name"${addAttribute(field("name"), "value")} required> </label> <label> <span>Template key *</span> <input type="text" name="templateKey"${addAttribute(field("templateKey"), "value")} pattern="[a-z0-9_]+" placeholder="game_seo_description" required> <small class="admin-field-note">Use lowercase letters, numbers, and underscores only.</small> </label> <label> <span>Target type *</span> <select name="targetType" required> <option value="">Choose target</option> ${targetTypes.map((targetType) => renderTemplate`<option${addAttribute(targetType, "value")}${addAttribute(field("targetType") === targetType, "selected")}> ${targetType} </option>`)} </select> </label> <label> <span>Action *</span> <select name="action" required> <option value="">Choose action</option> ${actions.map((action) => renderTemplate`<option${addAttribute(action, "value")}${addAttribute(field("action") === action, "selected")}> ${action} </option>`)} </select> </label> <label class="admin-form-wide"> <span>Description</span> <textarea name="description" rows="3">${field("description")}</textarea> </label> <label class="admin-form-wide"> <span>Variables</span> <textarea name="variables" rows="2" placeholder="title, category, description, tags">${variables}</textarea> <small class="admin-field-note">Separate variables with commas or new lines. They are saved as a JSON array.</small> </label> </div> </section> <section class="admin-settings-section" aria-labelledby="prompt-template-prompts-title"> <div class="admin-settings-section-heading"> <h2 id="prompt-template-prompts-title">Prompts</h2> <p>Use <code>${"{{variableName}}"}</code> placeholders inside prompts.</p> </div> <p class="admin-warning">
Example: Game title: ${"{{title}}"} · Category: ${"{{category}}"} </p> <div class="admin-form-grid"> <label class="admin-form-wide"> <span>System prompt</span> <textarea name="systemPrompt" rows="5" data-count-source="system-prompt">${field("systemPrompt")}</textarea> <small class="admin-field-note" data-count-target="system-prompt">0 characters · 0 lines</small> </label> <label class="admin-form-wide"> <span>User prompt *</span> <textarea name="userPrompt" rows="10" required data-count-source="user-prompt">${field("userPrompt")}</textarea> <small class="admin-field-note" data-count-target="user-prompt">0 characters · 0 lines</small> </label> </div> </section> <section class="admin-settings-section" aria-labelledby="prompt-template-preview-title"> <div class="admin-settings-section-heading"> <h2 id="prompt-template-preview-title">Preview</h2> <p>Render placeholders with sample data before saving or testing with an AI provider.</p> </div> <div class="admin-form-grid"> <label class="admin-form-wide"> <span>Sample variables JSON</span> <textarea name="sampleVariables" rows="9" data-preview-sample>${defaultSampleVariables}</textarea> <small class="admin-field-note">Use valid JSON. Missing variables render as empty strings.</small> </label> </div> <div class="admin-form-actions"> <button type="button" data-preview-prompt>Preview Prompt</button> </div> <div class="admin-prompt-preview-output" data-preview-output hidden> <div> <strong>Rendered system prompt</strong> <pre data-preview-system></pre> </div> <div> <strong>Rendered user prompt</strong> <pre data-preview-user></pre> </div> </div> <p class="admin-error" data-preview-error hidden></p> </section> <div class="admin-checkbox-grid"> <label><input type="checkbox" name="isActive"${addAttribute(checked("isActive"), "checked")}> Active</label> </div> <div class="admin-form-actions"> <button type="submit" name="intent" value="save">Save Template</button> ${mode === "edit" && renderTemplate`<button class="admin-danger-btn" type="submit" name="intent" value="deactivate">Deactivate Template</button>`} <a class="admin-link-btn" href="/admin/prompt-templates">Cancel</a> </div> </form> ${renderScript($$result, "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/components/admin/AdminPromptTemplateForm.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/components/admin/AdminPromptTemplateForm.astro", void 0);

export { $$AdminPromptTemplateForm as $ };
