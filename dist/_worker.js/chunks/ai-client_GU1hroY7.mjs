globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as adminGetDefaultAiProvider } from './ai-providers_Dsks5SxJ.mjs';
import { s as supabaseAdmin } from './supabase_C3sp2Zx_.mjs';

const DEFAULT_TIMEOUT_MS = 3e4;
const DEFAULT_MAX_TOKENS = 800;
const trimTrailingSlash = (value) => value.replace(/\/+$/, "");
const joinEndpoint = (baseUrl, path) => `${trimTrailingSlash(baseUrl)}${path}`;
const getErrorMessage = async (response) => {
  const bodyText = await response.text().catch(() => "");
  if (!bodyText) {
    return `AI provider request failed with status ${response.status}.`;
  }
  try {
    const body = JSON.parse(bodyText);
    if (typeof body.error === "string") {
      return body.error;
    }
    return body.error?.message ?? body.message ?? bodyText.slice(0, 300);
  } catch {
    return bodyText.slice(0, 300);
  }
};
const requestJson = async (url, init, timeoutMs = DEFAULT_TIMEOUT_MS) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...init,
      signal: controller.signal
    });
    if (!response.ok) {
      throw new Error(await getErrorMessage(response));
    }
    return response.json();
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("AI provider request timed out.");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
};
const getProviderByKey = async (providerKey) => {
  if (!supabaseAdmin) {
    return null;
  }
  const { data, error } = await supabaseAdmin.from("ai_providers").select("provider_key,provider_name,api_key_encrypted,base_url,default_model,is_enabled").eq("provider_key", providerKey).eq("is_enabled", true).maybeSingle();
  if (error || !data) {
    return null;
  }
  return {
    providerKey: data.provider_key,
    providerName: data.provider_name,
    apiKey: data.api_key_encrypted,
    baseUrl: data.base_url,
    defaultModel: data.default_model,
    isEnabled: data.is_enabled !== false
  };
};
const getProvider = async (providerKey) => {
  const provider = providerKey ? await getProviderByKey(providerKey) : (await adminGetDefaultAiProvider()).provider;
  if (!provider || !provider.isEnabled) {
    throw new Error("No AI provider is configured.");
  }
  if (!provider.apiKey) {
    throw new Error(`AI provider "${provider.providerName}" is missing an API key.`);
  }
  if (!provider.baseUrl) {
    throw new Error(`AI provider "${provider.providerName}" is missing a base URL.`);
  }
  if (!provider.defaultModel) {
    throw new Error(`AI provider "${provider.providerName}" is missing a default model.`);
  }
  return provider;
};
const extractOpenAiText = (raw) => {
  const response = raw;
  const content = response.choices?.[0]?.message?.content;
  if (typeof content === "string") {
    return content.trim();
  }
  if (Array.isArray(content)) {
    return content.map((part) => part.text ?? "").join("").trim();
  }
  return "";
};
const extractGeminiText = (raw) => {
  const response = raw;
  return response.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("").trim() ?? "";
};
const extractAnthropicText = (raw) => {
  const response = raw;
  return response.content?.filter((part) => part.type === "text" || typeof part.text === "string").map((part) => part.text ?? "").join("").trim() ?? "";
};
const generateOpenAiCompatibleText = async (provider, model, options) => {
  const messages = [
    ...options.system ? [{ role: "system", content: options.system }] : [],
    { role: "user", content: options.prompt }
  ];
  const raw = await requestJson(joinEndpoint(provider.baseUrl, "/chat/completions"), {
    method: "POST",
    headers: {
      authorization: `Bearer ${provider.apiKey}`,
      "content-type": "application/json",
      ...provider.providerKey === "openrouter" ? {
        "http-referer": "https://freegamezone.io",
        "x-title": "Free Game Zone"
      } : {}
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? DEFAULT_MAX_TOKENS
    })
  });
  const text = extractOpenAiText(raw);
  if (!text) {
    throw new Error("AI provider returned an empty response.");
  }
  return { text, raw };
};
const generateGeminiText = async (provider, model, options) => {
  const normalizedModel = model.startsWith("models/") ? model : `models/${model}`;
  const raw = await requestJson(
    joinEndpoint(provider.baseUrl, `/v1beta/${normalizedModel}:generateContent`),
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-goog-api-key": provider.apiKey
      },
      body: JSON.stringify({
        ...options.system ? {
          systemInstruction: {
            parts: [{ text: options.system }]
          }
        } : {},
        contents: [
          {
            role: "user",
            parts: [{ text: options.prompt }]
          }
        ],
        generationConfig: {
          temperature: options.temperature ?? 0.7,
          maxOutputTokens: options.maxTokens ?? DEFAULT_MAX_TOKENS
        }
      })
    }
  );
  const text = extractGeminiText(raw);
  if (!text) {
    throw new Error("AI provider returned an empty response.");
  }
  return { text, raw };
};
const generateAnthropicText = async (provider, model, options) => {
  const raw = await requestJson(joinEndpoint(provider.baseUrl, "/v1/messages"), {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": provider.apiKey,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model,
      max_tokens: options.maxTokens ?? DEFAULT_MAX_TOKENS,
      temperature: options.temperature ?? 0.7,
      ...options.system ? { system: options.system } : {},
      messages: [
        {
          role: "user",
          content: options.prompt
        }
      ]
    })
  });
  const text = extractAnthropicText(raw);
  if (!text) {
    throw new Error("AI provider returned an empty response.");
  }
  return { text, raw };
};
async function generateAiText(options) {
  const prompt = options.prompt.trim();
  if (!prompt) {
    throw new Error("Prompt is required.");
  }
  const provider = await getProvider(options.providerKey);
  const model = options.model?.trim() || provider.defaultModel;
  let generated;
  switch (provider.providerKey) {
    case "openai":
    case "openrouter":
      generated = await generateOpenAiCompatibleText(provider, model, { ...options, prompt });
      break;
    case "gemini":
      generated = await generateGeminiText(provider, model, { ...options, prompt });
      break;
    case "anthropic":
      generated = await generateAnthropicText(provider, model, { ...options, prompt });
      break;
    default:
      throw new Error(`Unsupported AI provider "${provider.providerKey}".`);
  }
  return {
    text: generated.text,
    providerKey: provider.providerKey,
    model,
    raw: generated.raw
  };
}

export { generateAiText as g };
