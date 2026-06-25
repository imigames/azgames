import { supabaseAdmin } from './supabase';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;

export interface AdminAiProvider {
  id: string;
  providerKey: string;
  providerName: string;
  apiKeyConfigured: boolean;
  apiKeyMasked: string | null;
  baseUrl: string | null;
  defaultModel: string | null;
  isEnabled: boolean;
  isDefault: boolean;
  settings: Record<string, unknown>;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface ServerAiProvider extends AdminAiProvider {
  apiKey: string | null;
}

export interface AiGenerationLog {
  id: string;
  providerKey: string | null;
  model: string | null;
  targetType: string;
  targetId: string | null;
  targetSlug: string | null;
  action: string;
  prompt: string | null;
  result: string | null;
  status: string;
  errorMessage: string | null;
  tokensInput: number | null;
  tokensOutput: number | null;
  costEstimate: number | null;
  createdAt: string | null;
}

export interface AdminAiProviderUpdateData {
  provider_name?: string;
  api_key?: string;
  base_url?: string;
  default_model?: string;
  is_enabled?: boolean;
  is_default?: boolean;
  settings?: Record<string, unknown>;
}

export interface CreateGenerationLogData {
  providerKey?: string;
  model?: string;
  targetType: string;
  targetId?: string;
  targetSlug?: string;
  action: string;
  prompt?: string;
  result?: string;
  status?: string;
  errorMessage?: string;
  tokensInput?: number;
  tokensOutput?: number;
  costEstimate?: number;
}

export interface ListGenerationLogsOptions {
  page?: number;
  limit?: number;
  providerKey?: string;
  targetType?: string;
  action?: string;
  status?: string;
}

interface AiProviderRow {
  id: string;
  provider_key: string;
  provider_name: string;
  api_key_encrypted: string | null;
  base_url: string | null;
  default_model: string | null;
  is_enabled: boolean | null;
  is_default: boolean | null;
  settings: Record<string, unknown> | null;
  created_at: string | null;
  updated_at: string | null;
}

interface AiGenerationLogRow {
  id: string;
  provider_key: string | null;
  model: string | null;
  target_type: string;
  target_id: string | null;
  target_slug: string | null;
  action: string;
  prompt: string | null;
  result: string | null;
  status: string | null;
  error_message: string | null;
  tokens_input: number | null;
  tokens_output: number | null;
  cost_estimate: number | string | null;
  created_at: string | null;
}

export interface AiMutationResult {
  success: boolean;
  error?: string;
}

export function maskSecret(secret: string | null | undefined) {
  if (!secret) {
    return null;
  }

  const trimmedSecret = secret.trim();

  if (trimmedSecret.length <= 8) {
    return `${trimmedSecret.slice(0, 2)}...${trimmedSecret.slice(-2)}`;
  }

  const prefix = trimmedSecret.startsWith('sk-') ? 'sk' : trimmedSecret.slice(0, 2);
  return `${prefix}...${trimmedSecret.slice(-4)}`;
}

const normalizePagination = ({ page = DEFAULT_PAGE, limit = DEFAULT_LIMIT }: ListGenerationLogsOptions = {}) => {
  const safePage = Number.isFinite(page) ? Math.max(1, Math.trunc(page)) : DEFAULT_PAGE;
  const safeLimit = Number.isFinite(limit)
    ? Math.min(MAX_LIMIT, Math.max(1, Math.trunc(limit)))
    : DEFAULT_LIMIT;
  const from = (safePage - 1) * safeLimit;

  return { page: safePage, limit: safeLimit, from, to: from + safeLimit - 1 };
};

const parseCost = (value: number | string | null) => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  if (!value) {
    return null;
  }

  const parsed = Number.parseFloat(value);
  return Number.isNaN(parsed) ? null : parsed;
};

const mapProvider = (provider: AiProviderRow): AdminAiProvider => ({
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
  updatedAt: provider.updated_at,
});

const mapServerProvider = (provider: AiProviderRow): ServerAiProvider => ({
  ...mapProvider(provider),
  apiKey: provider.api_key_encrypted,
});

const mapGenerationLog = (log: AiGenerationLogRow): AiGenerationLog => ({
  id: log.id,
  providerKey: log.provider_key,
  model: log.model,
  targetType: log.target_type,
  targetId: log.target_id,
  targetSlug: log.target_slug,
  action: log.action,
  prompt: log.prompt,
  result: log.result,
  status: log.status ?? 'success',
  errorMessage: log.error_message,
  tokensInput: log.tokens_input,
  tokensOutput: log.tokens_output,
  costEstimate: parseCost(log.cost_estimate),
  createdAt: log.created_at,
});

export async function adminListAiProviders(): Promise<{ providers: AdminAiProvider[]; error?: string }> {
  if (!import.meta.env.SSR || !supabaseAdmin) {
    return { providers: [], error: 'Supabase admin client is not configured.' };
  }

  const { data, error } = await supabaseAdmin
    .from('ai_providers')
    .select('*')
    .order('provider_name', { ascending: true });

  if (error) {
    return { providers: [], error: error.message };
  }

  return { providers: ((data ?? []) as AiProviderRow[]).map(mapProvider) };
}

export async function adminGetAiProvider(
  providerKey: string,
): Promise<{ provider: AdminAiProvider | null; error?: string }> {
  if (!import.meta.env.SSR || !supabaseAdmin) {
    return { provider: null, error: 'Supabase admin client is not configured.' };
  }

  const { data, error } = await supabaseAdmin
    .from('ai_providers')
    .select('*')
    .eq('provider_key', providerKey)
    .maybeSingle<AiProviderRow>();

  if (error) {
    return { provider: null, error: error.message };
  }

  return { provider: data ? mapProvider(data) : null };
}

export async function adminUpdateAiProvider(
  providerKey: string,
  data: AdminAiProviderUpdateData,
): Promise<AiMutationResult> {
  if (!import.meta.env.SSR || !supabaseAdmin) {
    return { success: false, error: 'Supabase admin client is not configured.' };
  }

  const normalizedProviderKey = providerKey.trim();

  if (!normalizedProviderKey) {
    return { success: false, error: 'Provider key is required.' };
  }

  if (data.is_default === true) {
    const { error } = await supabaseAdmin
      .from('ai_providers')
      .update({ is_default: false })
      .neq('provider_key', normalizedProviderKey);

    if (error) {
      return { success: false, error: error.message };
    }
  }

  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (data.provider_name !== undefined) {
    updateData.provider_name = data.provider_name.trim();
  }

  if (data.base_url !== undefined) {
    updateData.base_url = data.base_url.trim() || null;
  }

  if (data.default_model !== undefined) {
    updateData.default_model = data.default_model.trim() || null;
  }

  if (data.is_enabled !== undefined) {
    updateData.is_enabled = data.is_enabled;
  }

  if (data.is_default !== undefined) {
    updateData.is_default = data.is_default;
  }

  if (data.settings !== undefined) {
    updateData.settings = data.settings;
  }

  if (data.api_key !== undefined) {
    const apiKey = data.api_key.trim();

    if (apiKey === '__CLEAR__') {
      updateData.api_key_encrypted = null;
    } else if (apiKey) {
      updateData.api_key_encrypted = apiKey;
    }
  }

  const { error } = await supabaseAdmin
    .from('ai_providers')
    .update(updateData)
    .eq('provider_key', normalizedProviderKey);

  return error ? { success: false, error: error.message } : { success: true };
}

export async function adminGetDefaultAiProvider(): Promise<{
  provider: ServerAiProvider | null;
  error?: string;
}> {
  if (!import.meta.env.SSR || !supabaseAdmin) {
    return { provider: null, error: 'Supabase admin client is not configured.' };
  }

  const { data, error } = await supabaseAdmin
    .from('ai_providers')
    .select('*')
    .eq('is_enabled', true)
    .eq('is_default', true)
    .maybeSingle<AiProviderRow>();

  if (error) {
    return { provider: null, error: error.message };
  }

  return { provider: data ? mapServerProvider(data) : null };
}

export async function adminCreateGenerationLog(data: CreateGenerationLogData): Promise<AiMutationResult> {
  if (!import.meta.env.SSR || !supabaseAdmin) {
    return { success: false, error: 'Supabase admin client is not configured.' };
  }

  const targetType = data.targetType.trim();
  const action = data.action.trim();

  if (!targetType || !action) {
    return { success: false, error: 'targetType and action are required.' };
  }

  const { error } = await supabaseAdmin.from('ai_generation_logs').insert({
    provider_key: data.providerKey?.trim() || null,
    model: data.model?.trim() || null,
    target_type: targetType,
    target_id: data.targetId?.trim() || null,
    target_slug: data.targetSlug?.trim() || null,
    action,
    prompt: data.prompt ?? null,
    result: data.result ?? null,
    status: data.status?.trim() || 'success',
    error_message: data.errorMessage ?? null,
    tokens_input: data.tokensInput ?? null,
    tokens_output: data.tokensOutput ?? null,
    cost_estimate: data.costEstimate ?? null,
  });

  return error ? { success: false, error: error.message } : { success: true };
}

export async function adminListGenerationLogs({
  page,
  limit,
  providerKey,
  targetType,
  action,
  status,
}: ListGenerationLogsOptions = {}): Promise<{
  logs: AiGenerationLog[];
  page: number;
  limit: number;
  hasNext: boolean;
  error?: string;
}> {
  const pagination = normalizePagination({ page, limit });

  if (!import.meta.env.SSR || !supabaseAdmin) {
    return {
      logs: [],
      page: pagination.page,
      limit: pagination.limit,
      hasNext: false,
      error: 'Supabase admin client is not configured.',
    };
  }

  let query = supabaseAdmin
    .from('ai_generation_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .range(pagination.from, pagination.to);

  if (providerKey) {
    query = query.eq('provider_key', providerKey);
  }

  if (targetType) {
    query = query.eq('target_type', targetType);
  }

  if (action) {
    query = query.eq('action', action);
  }

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    return {
      logs: [],
      page: pagination.page,
      limit: pagination.limit,
      hasNext: false,
      error: error.message,
    };
  }

  const logs = ((data ?? []) as AiGenerationLogRow[]).map(mapGenerationLog);

  return {
    logs,
    page: pagination.page,
    limit: pagination.limit,
    hasNext: logs.length === pagination.limit,
  };
}
