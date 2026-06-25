import { adminGetDefaultAiProvider } from './ai-providers';
import { supabaseAdmin } from './supabase';

export type AiGenerateOptions = {
  providerKey?: string;
  model?: string;
  system?: string;
  prompt: string;
  temperature?: number;
  maxTokens?: number;
};

type AiGenerateResult = {
  text: string;
  providerKey: string;
  model: string;
  raw?: unknown;
};

type ServerProvider = {
  providerKey: string;
  providerName: string;
  apiKey: string | null;
  baseUrl: string | null;
  defaultModel: string | null;
  isEnabled: boolean;
};

type ProviderRow = {
  provider_key: string;
  provider_name: string;
  api_key_encrypted: string | null;
  base_url: string | null;
  default_model: string | null;
  is_enabled: boolean | null;
};

const DEFAULT_TIMEOUT_MS = 30_000;
const DEFAULT_MAX_TOKENS = 800;

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

const joinEndpoint = (baseUrl: string, path: string) => `${trimTrailingSlash(baseUrl)}${path}`;

const getErrorMessage = async (response: Response) => {
  const bodyText = await response.text().catch(() => '');

  if (!bodyText) {
    return `AI provider request failed with status ${response.status}.`;
  }

  try {
    const body = JSON.parse(bodyText) as {
      error?: { message?: string } | string;
      message?: string;
    };

    if (typeof body.error === 'string') {
      return body.error;
    }

    return body.error?.message ?? body.message ?? bodyText.slice(0, 300);
  } catch {
    return bodyText.slice(0, 300);
  }
};

const requestJson = async (url: string, init: RequestInit, timeoutMs = DEFAULT_TIMEOUT_MS) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...init,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(await getErrorMessage(response));
    }

    return response.json() as Promise<unknown>;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('AI provider request timed out.');
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
};

const getProviderByKey = async (providerKey: string): Promise<ServerProvider | null> => {
  if (!import.meta.env.SSR || !supabaseAdmin) {
    return null;
  }

  const { data, error } = await supabaseAdmin
    .from('ai_providers')
    .select('provider_key,provider_name,api_key_encrypted,base_url,default_model,is_enabled')
    .eq('provider_key', providerKey)
    .eq('is_enabled', true)
    .maybeSingle<ProviderRow>();

  if (error || !data) {
    return null;
  }

  return {
    providerKey: data.provider_key,
    providerName: data.provider_name,
    apiKey: data.api_key_encrypted,
    baseUrl: data.base_url,
    defaultModel: data.default_model,
    isEnabled: data.is_enabled !== false,
  };
};

const getProvider = async (providerKey?: string): Promise<ServerProvider> => {
  if (!import.meta.env.SSR) {
    throw new Error('AI generation is only available on the server.');
  }

  const provider = providerKey
    ? await getProviderByKey(providerKey)
    : (await adminGetDefaultAiProvider()).provider;

  if (!provider || !provider.isEnabled) {
    throw new Error('No AI provider is configured.');
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

const extractOpenAiText = (raw: unknown) => {
  const response = raw as {
    choices?: Array<{ message?: { content?: string | Array<{ text?: string }> } }>;
  };
  const content = response.choices?.[0]?.message?.content;

  if (typeof content === 'string') {
    return content.trim();
  }

  if (Array.isArray(content)) {
    return content
      .map((part) => part.text ?? '')
      .join('')
      .trim();
  }

  return '';
};

const extractGeminiText = (raw: unknown) => {
  const response = raw as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };

  return (
    response.candidates?.[0]?.content?.parts
      ?.map((part) => part.text ?? '')
      .join('')
      .trim() ?? ''
  );
};

const extractAnthropicText = (raw: unknown) => {
  const response = raw as {
    content?: Array<{ type?: string; text?: string }>;
  };

  return (
    response.content
      ?.filter((part) => part.type === 'text' || typeof part.text === 'string')
      .map((part) => part.text ?? '')
      .join('')
      .trim() ?? ''
  );
};

const generateOpenAiCompatibleText = async (
  provider: ServerProvider,
  model: string,
  options: AiGenerateOptions,
) => {
  const messages = [
    ...(options.system ? [{ role: 'system', content: options.system }] : []),
    { role: 'user', content: options.prompt },
  ];

  const raw = await requestJson(joinEndpoint(provider.baseUrl!, '/chat/completions'), {
    method: 'POST',
    headers: {
      authorization: `Bearer ${provider.apiKey}`,
      'content-type': 'application/json',
      ...(provider.providerKey === 'openrouter'
        ? {
            'http-referer': 'https://freegamezone.io',
            'x-title': 'Free Game Zone',
          }
        : {}),
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? DEFAULT_MAX_TOKENS,
    }),
  });

  const text = extractOpenAiText(raw);

  if (!text) {
    throw new Error('AI provider returned an empty response.');
  }

  return { text, raw };
};

const generateGeminiText = async (
  provider: ServerProvider,
  model: string,
  options: AiGenerateOptions,
) => {
  const normalizedModel = model.startsWith('models/') ? model : `models/${model}`;
  const raw = await requestJson(
    joinEndpoint(provider.baseUrl!, `/v1beta/${normalizedModel}:generateContent`),
    {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-goog-api-key': provider.apiKey!,
      },
      body: JSON.stringify({
        ...(options.system
          ? {
              systemInstruction: {
                parts: [{ text: options.system }],
              },
            }
          : {}),
        contents: [
          {
            role: 'user',
            parts: [{ text: options.prompt }],
          },
        ],
        generationConfig: {
          temperature: options.temperature ?? 0.7,
          maxOutputTokens: options.maxTokens ?? DEFAULT_MAX_TOKENS,
        },
      }),
    },
  );

  const text = extractGeminiText(raw);

  if (!text) {
    throw new Error('AI provider returned an empty response.');
  }

  return { text, raw };
};

const generateAnthropicText = async (
  provider: ServerProvider,
  model: string,
  options: AiGenerateOptions,
) => {
  const raw = await requestJson(joinEndpoint(provider.baseUrl!, '/v1/messages'), {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': provider.apiKey!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: options.maxTokens ?? DEFAULT_MAX_TOKENS,
      temperature: options.temperature ?? 0.7,
      ...(options.system ? { system: options.system } : {}),
      messages: [
        {
          role: 'user',
          content: options.prompt,
        },
      ],
    }),
  });

  const text = extractAnthropicText(raw);

  if (!text) {
    throw new Error('AI provider returned an empty response.');
  }

  return { text, raw };
};

export async function generateAiText(options: AiGenerateOptions): Promise<AiGenerateResult> {
  const prompt = options.prompt.trim();

  if (!prompt) {
    throw new Error('Prompt is required.');
  }

  const provider = await getProvider(options.providerKey);
  const model = options.model?.trim() || provider.defaultModel!;
  let generated: { text: string; raw: unknown };

  switch (provider.providerKey) {
    case 'openai':
    case 'openrouter':
      generated = await generateOpenAiCompatibleText(provider, model, { ...options, prompt });
      break;
    case 'gemini':
      generated = await generateGeminiText(provider, model, { ...options, prompt });
      break;
    case 'anthropic':
      generated = await generateAnthropicText(provider, model, { ...options, prompt });
      break;
    default:
      throw new Error(`Unsupported AI provider "${provider.providerKey}".`);
  }

  return {
    text: generated.text,
    providerKey: provider.providerKey,
    model,
    raw: generated.raw,
  };
}
