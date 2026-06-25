globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../../../chunks/astro/server_jqlxmikg.mjs';
import { $ as $$AdminLayout } from '../../../chunks/AdminLayout_DpMMXuWw.mjs';
import { g as generateAiText } from '../../../chunks/ai-client_GU1hroY7.mjs';
import { a as adminListAiProviders, b as adminCreateGenerationLog } from '../../../chunks/ai-providers_Dsks5SxJ.mjs';
export { renderers } from '../../../renderers.mjs';

const $$Astro = createAstro("https://freegamezone.io");
const prerender = false;
const $$Test = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Test;
  const defaultPrompt = "Write a short SEO description for an online browser game called Poxel io.";
  const providersResult = await adminListAiProviders();
  const enabledProviders = providersResult.providers.filter((provider) => provider.isEnabled);
  const allProviders = providersResult.providers;
  const providerKeys = new Set(allProviders.map((provider) => provider.providerKey));
  let providerKey = Astro2.url.searchParams.get("provider")?.trim() || enabledProviders.find((provider) => provider.isDefault)?.providerKey || enabledProviders[0]?.providerKey || allProviders[0]?.providerKey || "";
  let model = allProviders.find((provider) => provider.providerKey === providerKey)?.defaultModel ?? "";
  let prompt = defaultPrompt;
  let generatedText = "";
  let usedProviderKey = "";
  let usedModel = "";
  let error = providersResult.error ?? "";
  if (Astro2.request.method === "POST") {
    const formData = await Astro2.request.formData();
    providerKey = String(formData.get("providerKey") ?? "").trim();
    model = String(formData.get("model") ?? "").trim();
    prompt = String(formData.get("prompt") ?? "").trim();
    if (!providerKeys.has(providerKey)) {
      error = "Choose a valid AI provider.";
    } else if (!prompt) {
      error = "Prompt is required.";
    } else {
      try {
        const result = await generateAiText({
          providerKey,
          model,
          prompt,
          temperature: 0.7,
          maxTokens: 220
        });
        generatedText = result.text;
        usedProviderKey = result.providerKey;
        usedModel = result.model;
        error = "";
        await adminCreateGenerationLog({
          providerKey: result.providerKey,
          model: result.model,
          targetType: "test",
          action: "test_generation",
          prompt,
          result: result.text,
          status: "success"
        });
      } catch (generationError) {
        const message = generationError instanceof Error ? generationError.message : "AI test generation failed.";
        error = message;
        await adminCreateGenerationLog({
          providerKey,
          model,
          targetType: "test",
          action: "test_generation",
          prompt,
          status: "error",
          errorMessage: message
        });
      }
    }
  }
  const selectedProvider = allProviders.find((provider) => provider.providerKey === providerKey);
  if (!model && selectedProvider?.defaultModel) {
    model = selectedProvider.defaultModel;
  }
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Test AI Model | Free Game Zone", "description": "Run a server-side test generation with a configured AI provider." }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="admin-list-page" aria-labelledby="admin-ai-test-title"> <div class="admin-list-heading"> <div> <h1 id="admin-ai-test-title">Test AI Model</h1> <p>Run a server-side test generation without exposing API keys to the browser.</p> </div> <a class="admin-link-btn" href="/admin/ai-models">Ai Models</a> </div> ${error && renderTemplate`<p class="admin-error">${error}</p>`} <form class="admin-game-form admin-settings-form" method="post" action="/admin/ai-models/test"> <section class="admin-settings-section" aria-labelledby="ai-test-form-title"> <div class="admin-settings-section-heading"> <h2 id="ai-test-form-title">Generation test</h2> <p>Select a provider, choose a model, and send a short prompt.</p> </div> <div class="admin-form-grid"> <label> <span>Provider</span> <select name="providerKey" required> ${allProviders.map((provider) => renderTemplate`<option${addAttribute(provider.providerKey, "value")}${addAttribute(provider.providerKey === providerKey, "selected")}> ${provider.providerName}${provider.isEnabled ? "" : " (disabled)"} </option>`)} </select> </label> <label> <span>Model</span> <input type="text" name="model"${addAttribute(model, "value")}${addAttribute(selectedProvider?.defaultModel ?? "Provider default model", "placeholder")}> </label> <label class="admin-form-wide"> <span>Prompt</span> <textarea name="prompt" rows="5" required>${prompt}</textarea> </label> </div> </section> <div class="admin-form-actions"> <button type="submit">Test generation</button> </div> </form> ${generatedText && renderTemplate`<section class="admin-form-card" aria-labelledby="ai-test-result-title"> <div class="admin-settings-section-heading"> <h2 id="ai-test-result-title">Generated result</h2> <p>
Provider: ${usedProviderKey} · Model: ${usedModel} </p> </div> <div class="ai-test-result-box">${generatedText}</div> </section>`} </section> ` })}`;
}, "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/pages/admin/ai-models/test.astro", void 0);

const $$file = "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/pages/admin/ai-models/test.astro";
const $$url = "/admin/ai-models/test";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Test,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
