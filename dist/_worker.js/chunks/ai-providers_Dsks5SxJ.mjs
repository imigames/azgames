globalThis.process ??= {}; globalThis.process.env ??= {};
import { s as supabaseAdmin } from './supabase_C3sp2Zx_.mjs';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;
function maskSecret(secret) {
  if (!secret) {
    return null;
  }
  const trimmedSecret = secret.trim();
  if (trimmedSecret.length <= 8) {
    return `${trimmedSecret.slice(0, 2)}...${trimmedSecret.slice(-2)}`;
  }
  const prefix = trimmedSecret.startsWith("sk-") ? "sk" : trimmedSecret.slice(0, 2);
  return `${prefix}...${trimmedSecret.slice(-4)}`;
}
const normalizePagination = ({ page = DEFAULT_PAGE, limit = DEFAULT_LIMIT } = {}) => {
  const safePage = Number.isFinite(page) ? Math.max(1, Math.trunc(page)) : DEFAULT_PAGE;
  const safeLimit = Number.isFinite(limit) ? Math.min(MAX_LIMIT, Math.max(1, Math.trunc(limit))) : DEFAULT_LIMIT;
  const from = (safePage - 1) * safeLimit;
  return { page: safePage, limit: safeLimit, from, to: from + safeLimit - 1 };
};
const parseCost = (value) => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }
  if (!value) {
    return null;
  }
  const parsed = Number.parseFloat(value);
  return Number.isNaN(parsed) ? null : parsed;
};
const mapProvider = (provider) => ({
  id: provider.id,
  providerKey: provider.provider_key,
  providerName: provider.provider_name,
  apiKeyConfigured: Boolean(provider.api_key_encrypted),
  apiKeyMasked: maskSecret(provider.api_key_encrypted),
  baseUrl: provider.base_url,
  defaultModel: provider.default_model,
  isEnabled: Boolean(provider.is_enabled),
  isDefault: Boolean(provider.is_default),
  settings: provider.settings ?? {},
  createdAt: provider.created_at,
  updatedAt: provider.updated_at
});
const mapServerProvider = (provider) => ({
  ...mapProvider(provider),
  apiKey: provider.api_key_encrypted
});
const mapGenerationLog = (log) => ({
  id: log.id,
  providerKey: log.provider_key,
  model: log.model,
  targetType: log.target_type,
  targetId: log.target_id,
  targetSlug: log.target_slug,
  action: log.action,
  prompt: log.prompt,
  result: log.result,
  status: log.status ?? "success",
  errorMessage: log.error_message,
  tokensInput: log.tokens_input,
  tokensOutput: log.tokens_output,
  costEstimate: parseCost(log.cost_estimate),
  createdAt: log.created_at
});
async function adminListAiProviders() {
  if (!supabaseAdmin) {
    return { providers: [], error: "Supabase admin client is not configured." };
  }
  const { data, error } = await supabaseAdmin.from("ai_providers").select("*").order("provider_name", { ascending: true });
  if (error) {
    return { providers: [], error: error.message };
  }
  return { providers: (data ?? []).map(mapProvider) };
}
async function adminUpdateAiProvider(providerKey, data) {
  if (!supabaseAdmin) {
    return { success: false, error: "Supabase admin client is not configured." };
  }
  const normalizedProviderKey = providerKey.trim();
  if (!normalizedProviderKey) {
    return { success: false, error: "Provider key is required." };
  }
  if (data.is_default === true) {
    const { error: error2 } = await supabaseAdmin.from("ai_providers").update({ is_default: false }).neq("provider_key", normalizedProviderKey);
    if (error2) {
      return { success: false, error: error2.message };
    }
  }
  const updateData = {
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  if (data.provider_name !== void 0) {
    updateData.provider_name = data.provider_name.trim();
  }
  if (data.base_url !== void 0) {
    updateData.base_url = data.base_url.trim() || null;
  }
  if (data.default_model !== void 0) {
    updateData.default_model = data.default_model.trim() || null;
  }
  if (data.is_enabled !== void 0) {
    updateData.is_enabled = data.is_enabled;
  }
  if (data.is_default !== void 0) {
    updateData.is_default = data.is_default;
  }
  if (data.settings !== void 0) {
    updateData.settings = data.settings;
  }
  if (data.api_key !== void 0) {
    const apiKey = data.api_key.trim();
    if (apiKey === "__CLEAR__") {
      updateData.api_key_encrypted = null;
    } else if (apiKey) {
      updateData.api_key_encrypted = apiKey;
    }
  }
  const { error } = await supabaseAdmin.from("ai_providers").update(updateData).eq("provider_key", normalizedProviderKey);
  return error ? { success: false, error: error.message } : { success: true };
}
async function adminGetDefaultAiProvider() {
  if (!supabaseAdmin) {
    return { provider: null, error: "Supabase admin client is not configured." };
  }
  const { data, error } = await supabaseAdmin.from("ai_providers").select("*").eq("is_enabled", true).eq("is_default", true).maybeSingle();
  if (error) {
    return { provider: null, error: error.message };
  }
  return { provider: data ? mapServerProvider(data) : null };
}
async function adminCreateGenerationLog(data) {
  if (!supabaseAdmin) {
    return { success: false, error: "Supabase admin client is not configured." };
  }
  const targetType = data.targetType.trim();
  const action = data.action.trim();
  if (!targetType || !action) {
    return { success: false, error: "targetType and action are required." };
  }
  const { error } = await supabaseAdmin.from("ai_generation_logs").insert({
    provider_key: data.providerKey?.trim() || null,
    model: data.model?.trim() || null,
    target_type: targetType,
    target_id: data.targetId?.trim() || null,
    target_slug: data.targetSlug?.trim() || null,
    action,
    prompt: data.prompt ?? null,
    result: data.result ?? null,
    status: data.status?.trim() || "success",
    error_message: data.errorMessage ?? null,
    tokens_input: data.tokensInput ?? null,
    tokens_output: data.tokensOutput ?? null,
    cost_estimate: data.costEstimate ?? null
  });
  return error ? { success: false, error: error.message } : { success: true };
}
async function adminListGenerationLogs({
  page,
  limit,
  providerKey,
  targetType,
  action,
  status
} = {}) {
  const pagination = normalizePagination({ page, limit });
  if (!supabaseAdmin) {
    return {
      logs: [],
      page: pagination.page,
      limit: pagination.limit,
      hasNext: false,
      error: "Supabase admin client is not configured."
    };
  }
  let query = supabaseAdmin.from("ai_generation_logs").select("*").order("created_at", { ascending: false }).range(pagination.from, pagination.to);
  if (providerKey) {
    query = query.eq("provider_key", providerKey);
  }
  if (targetType) {
    query = query.eq("target_type", targetType);
  }
  if (action) {
    query = query.eq("action", action);
  }
  if (status) {
    query = query.eq("status", status);
  }
  const { data, error } = await query;
  if (error) {
    return {
      logs: [],
      page: pagination.page,
      limit: pagination.limit,
      hasNext: false,
      error: error.message
    };
  }
  const logs = (data ?? []).map(mapGenerationLog);
  return {
    logs,
    page: pagination.page,
    limit: pagination.limit,
    hasNext: logs.length === pagination.limit
  };
}

export { adminListAiProviders as a, adminCreateGenerationLog as b, adminListGenerationLogs as c, adminUpdateAiProvider as d, adminGetDefaultAiProvider as e };
