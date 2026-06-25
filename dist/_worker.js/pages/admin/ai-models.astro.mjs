globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate, h as addAttribute, m as maybeRenderHead } from '../../chunks/astro/server_jqlxmikg.mjs';
import { $ as $$AdminLayout } from '../../chunks/AdminLayout_DpMMXuWw.mjs';
import { d as adminUpdateAiProvider, a as adminListAiProviders } from '../../chunks/ai-providers_Dsks5SxJ.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://freegamezone.io");
const prerender = false;
const $$AiModels = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$AiModels;
  const providerMeta = [
    {
      providerKey: "openai",
      providerName: "OpenAI",
      baseUrl: "https://api.openai.com/v1",
      defaultModel: "gpt-4.1-mini",
      note: "API key from OpenAI platform"
    },
    {
      providerKey: "gemini",
      providerName: "Google Gemini",
      baseUrl: "https://generativelanguage.googleapis.com",
      defaultModel: "gemini-2.5-flash",
      note: "API key from Google AI Studio / Gemini API"
    },
    {
      providerKey: "anthropic",
      providerName: "Anthropic Claude",
      baseUrl: "https://api.anthropic.com",
      defaultModel: "claude-sonnet-4-5",
      note: "API key from Anthropic Console"
    },
    {
      providerKey: "openrouter",
      providerName: "OpenRouter",
      baseUrl: "https://openrouter.ai/api/v1",
      defaultModel: "openai/gpt-4.1-mini",
      note: "API key from OpenRouter"
    }
  ];
  const providerKeys = new Set(providerMeta.map((provider) => provider.providerKey));
  let selectedProviderKey = Astro2.url.searchParams.get("provider")?.trim() || "openai";
  let actionError = "";
  let actionSuccess = "";
  if (!providerKeys.has(selectedProviderKey)) {
    selectedProviderKey = "openai";
  }
  if (Astro2.request.method === "POST") {
    const formData = await Astro2.request.formData();
    const intent = String(formData.get("intent") ?? "save");
    selectedProviderKey = String(formData.get("provider_key") ?? "").trim();
    if (!providerKeys.has(selectedProviderKey)) {
      actionError = "Choose a valid AI provider.";
      selectedProviderKey = "openai";
    } else {
      const isEnabled = formData.get("is_enabled") === "on";
      const isDefault = formData.get("is_default") === "on";
      if (isDefault && !isEnabled) {
        actionError = "A default provider must also be enabled.";
      } else {
        const result = await adminUpdateAiProvider(selectedProviderKey, {
          provider_name: String(formData.get("provider_name") ?? "").trim(),
          api_key: intent === "clear-key" ? "__CLEAR__" : String(formData.get("api_key") ?? ""),
          base_url: String(formData.get("base_url") ?? "").trim(),
          default_model: String(formData.get("default_model") ?? "").trim(),
          is_enabled: isEnabled,
          is_default: isDefault
        });
        if (result.success) {
          actionSuccess = intent === "clear-key" ? "API key cleared successfully." : "AI provider saved successfully.";
        } else {
          actionError = result.error ?? "Unable to save AI provider.";
        }
      }
    }
  }
  const providersResult = await adminListAiProviders();
  const providersByKey = new Map(providersResult.providers.map((provider) => [provider.providerKey, provider]));
  const providers = providerMeta.map((meta) => {
    const provider = providersByKey.get(meta.providerKey);
    return {
      id: provider?.id ?? meta.providerKey,
      providerKey: meta.providerKey,
      providerName: provider?.providerName ?? meta.providerName,
      apiKeyConfigured: provider?.apiKeyConfigured ?? false,
      apiKeyMasked: provider?.apiKeyMasked ?? null,
      baseUrl: provider?.baseUrl ?? meta.baseUrl,
      defaultModel: provider?.defaultModel ?? meta.defaultModel,
      isEnabled: provider?.isEnabled ?? false,
      isDefault: provider?.isDefault ?? false,
      settings: provider?.settings ?? {},
      createdAt: provider?.createdAt ?? null,
      updatedAt: provider?.updatedAt ?? null,
      note: meta.note
    };
  });
  const selectedProvider = providers.find((provider) => provider.providerKey === selectedProviderKey) ?? providers[0];
  const pageError = actionError || providersResult.error || "";
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Ai Models | Free Game Zone", "description": "Connect AI providers to generate SEO content for games and categories." }, { "actions": async ($$result2) => renderTemplate`${maybeRenderHead()}<div class="admin-header-actions"> <a class="admin-link-btn" href="/admin/ai-models/bulk">Bulk generation</a> <a class="admin-link-btn" href="/admin/ai-models/logs">View generation logs</a> </div>`, "default": async ($$result2) => renderTemplate`  <section class="admin-list-page" aria-labelledby="admin-ai-models-title"> <h1 id="admin-ai-models-title" class="sr-only">Ai Models</h1> ${pageError && renderTemplate`<p class="admin-error">${pageError}</p>`} ${actionSuccess && renderTemplate`<p class="admin-success">${actionSuccess}</p>`} <section class="ai-provider-grid" aria-label="AI providers"> ${providers.map((provider) => renderTemplate`<article class="admin-card ai-provider-card"> <div class="ai-provider-card-header"> <h2>${provider.providerName}</h2> <div class="ai-provider-badges"> <span${addAttribute(["admin-status-badge", provider.isEnabled ? "is-ok" : "is-muted"], "class:list")}> ${provider.isEnabled ? "Enabled" : "Disabled"} </span> ${provider.isDefault && renderTemplate`<span class="admin-status-badge is-accent">Default</span>`} </div> </div> <dl class="ai-provider-details"> <div> <dt>Default model</dt> <dd>${provider.defaultModel || "-"}</dd> </div> <div> <dt>API key</dt> <dd> ${provider.apiKeyConfigured ? `Connected ${provider.apiKeyMasked ?? ""}` : "Not connected"} </dd> </div> <div> <dt>Base URL</dt> <dd>${provider.baseUrl || "-"}</dd> </div> </dl> <div class="admin-form-actions"> <a class="admin-primary-btn"${addAttribute(`/admin/ai-models?provider=${provider.providerKey}`, "href")}>
Configure
</a> <a class="admin-link-btn"${addAttribute(`/admin/ai-models/test?provider=${provider.providerKey}`, "href")}>
Test
</a> </div> </article>`)} </section> <form class="admin-game-form admin-settings-form" method="post"${addAttribute(`/admin/ai-models?provider=${selectedProvider.providerKey}`, "action")}> <input type="hidden" name="provider_key"${addAttribute(selectedProvider.providerKey, "value")}> <section class="admin-settings-section" aria-labelledby="ai-provider-config-title"> <div class="admin-settings-section-heading"> <h2 id="ai-provider-config-title">Configure ${selectedProvider.providerName}</h2> <p>${selectedProvider.note}</p> </div> <p class="admin-warning">
API keys are stored for server-side use only. Do not share your keys.
</p> <div class="admin-form-grid"> <label> <span>Provider name</span> <input type="text" name="provider_name"${addAttribute(selectedProvider.providerName, "value")} required> </label> <label> <span>API key</span> <input type="password" name="api_key" autocomplete="new-password" placeholder="Leave empty to keep current key"> <small class="admin-field-note">
Current status: ${selectedProvider.apiKeyConfigured ? `Connected ${selectedProvider.apiKeyMasked ?? ""}` : "Not connected"} </small> </label> <label> <span>Base URL</span> <input type="url" name="base_url"${addAttribute(selectedProvider.baseUrl ?? "", "value")}> </label> <label> <span>Default model</span> <input type="text" name="default_model"${addAttribute(selectedProvider.defaultModel ?? "", "value")}> </label> </div> <div class="admin-checkbox-grid"> <label> <input type="checkbox" name="is_enabled"${addAttribute(selectedProvider.isEnabled, "checked")}>
Enabled
</label> <label> <input type="checkbox" name="is_default"${addAttribute(selectedProvider.isDefault, "checked")}>
Set as default
</label> </div> </section> <div class="admin-form-actions"> <button type="submit" name="intent" value="save">Save Provider</button> <button class="admin-danger-btn" type="submit" name="intent" value="clear-key"${addAttribute(!selectedProvider.apiKeyConfigured, "disabled")}>
Clear API key
</button> </div> </form> </section> ` })}`;
}, "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/pages/admin/ai-models.astro", void 0);

const $$file = "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/pages/admin/ai-models.astro";
const $$url = "/admin/ai-models";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$AiModels,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
