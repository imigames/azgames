import { supabaseAdmin } from './supabase';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 40;
const MAX_LIMIT = 100;

type PromptVariableValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | Array<string | number | boolean>;

export type PromptTemplateVariables = Record<string, PromptVariableValue>;

export interface PromptTemplate {
  id: string;
  templateKey: string;
  name: string;
  description: string | null;
  targetType: string | null;
  action: string | null;
  variables: string[];
  systemPrompt: string | null;
  userPrompt: string;
  isActive: boolean;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface AdminListPromptTemplatesOptions {
  targetType?: string;
  action?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface AdminPromptTemplateData {
  templateKey: string;
  name: string;
  description?: string;
  targetType?: string;
  action?: string;
  variables?: string[];
  systemPrompt?: string;
  userPrompt: string;
  isActive?: boolean;
}

export interface PromptTemplateMutationResult {
  success: boolean;
  error?: string;
}

interface PromptTemplateRow {
  id: string;
  template_key: string;
  name: string;
  description?: string | null;
  target_type?: string | null;
  action?: string | null;
  variables?: unknown;
  system_prompt: string | null;
  user_prompt: string;
  is_active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

const normalizePagination = ({
  page = DEFAULT_PAGE,
  limit = DEFAULT_LIMIT,
}: AdminListPromptTemplatesOptions = {}) => {
  const safePage = Number.isFinite(page) ? Math.max(1, Math.trunc(page)) : DEFAULT_PAGE;
  const safeLimit = Number.isFinite(limit)
    ? Math.min(MAX_LIMIT, Math.max(1, Math.trunc(limit)))
    : DEFAULT_LIMIT;
  const from = (safePage - 1) * safeLimit;

  return { page: safePage, limit: safeLimit, from, to: from + safeLimit };
};

const normalizeText = (value: string | undefined) => value?.trim() ?? '';
const templateKeyPattern = /^[a-z0-9_]+$/;

const normalizeVariables = (variables: unknown): string[] => {
  if (!Array.isArray(variables)) {
    return [];
  }

  return [
    ...new Set(
      variables
        .map((variable) => String(variable).trim())
        .filter(Boolean),
    ),
  ];
};

const mapPromptTemplate = (template: PromptTemplateRow): PromptTemplate => ({
  id: template.id,
  templateKey: template.template_key,
  name: template.name,
  description: template.description ?? null,
  targetType: template.target_type ?? null,
  action: template.action ?? null,
  variables: normalizeVariables(template.variables),
  systemPrompt: template.system_prompt,
  userPrompt: template.user_prompt,
  isActive: template.is_active !== false,
  createdAt: template.created_at,
  updatedAt: template.updated_at,
});

const isSchemaColumnError = (errorMessage: string) =>
  errorMessage.includes('Could not find') ||
  errorMessage.includes('column') ||
  errorMessage.includes('schema cache');

const getPayload = (data: AdminPromptTemplateData, includeExtendedColumns = true) => {
  const targetType = normalizeText(data.targetType);
  const action = normalizeText(data.action);
  const payload: Record<string, unknown> = {
    template_key: normalizeText(data.templateKey),
    name: normalizeText(data.name),
    system_prompt: normalizeText(data.systemPrompt) || null,
    user_prompt: normalizeText(data.userPrompt),
    is_active: data.isActive ?? true,
    updated_at: new Date().toISOString(),
  };

  if (includeExtendedColumns) {
    payload.description = normalizeText(data.description) || null;
    payload.target_type = targetType || null;
    payload.action = action || null;
    payload.variables = normalizeVariables(data.variables);
  }

  return payload;
};

const validatePayload = (payload: Record<string, unknown>) => {
  if (!payload.template_key) {
    return 'Template key is required.';
  }

  if (typeof payload.template_key === 'string' && !templateKeyPattern.test(payload.template_key)) {
    return 'Template key must use lowercase letters, numbers, and underscores only.';
  }

  if (!payload.name) {
    return 'Name is required.';
  }

  if (!payload.target_type) {
    return 'Target type is required.';
  }

  if (!payload.action) {
    return 'Action is required.';
  }

  if (!payload.user_prompt) {
    return 'User prompt is required.';
  }

  return '';
};

const filterTemplates = (
  templates: PromptTemplate[],
  { targetType = '', action = '', search = '' }: AdminListPromptTemplatesOptions,
) => {
  const normalizedTargetType = targetType.trim().toLowerCase();
  const normalizedAction = action.trim().toLowerCase();
  const normalizedSearch = search.trim().toLowerCase();

  return templates.filter((template) => {
    if (normalizedTargetType && template.targetType?.toLowerCase() !== normalizedTargetType) {
      return false;
    }

    if (normalizedAction && template.action?.toLowerCase() !== normalizedAction) {
      return false;
    }

    if (!normalizedSearch) {
      return true;
    }

    return [template.name, template.templateKey, template.description ?? '']
      .join(' ')
      .toLowerCase()
      .includes(normalizedSearch);
  });
};

const hasDuplicateTemplateKey = async (templateKey: string, currentId?: string) => {
  if (!supabaseAdmin) {
    return false;
  }

  let query = supabaseAdmin
    .from('ai_prompt_templates')
    .select('id')
    .eq('template_key', templateKey)
    .limit(1);

  if (currentId) {
    query = query.neq('id', currentId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return Boolean(data?.length);
};

export async function adminListPromptTemplates(
  options: AdminListPromptTemplatesOptions = {},
): Promise<{
  templates: PromptTemplate[];
  page: number;
  limit: number;
  total: number;
  hasNext: boolean;
  error?: string;
}> {
  const pagination = normalizePagination(options);

  if (!import.meta.env.SSR || !supabaseAdmin) {
    return {
      templates: [],
      page: pagination.page,
      limit: pagination.limit,
      total: 0,
      hasNext: false,
      error: 'Supabase admin client is not configured.',
    };
  }

  const { data, error } = await supabaseAdmin
    .from('ai_prompt_templates')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(500);

  if (error) {
    return {
      templates: [],
      page: pagination.page,
      limit: pagination.limit,
      total: 0,
      hasNext: false,
      error: error.message,
    };
  }

  const filtered = filterTemplates(((data ?? []) as PromptTemplateRow[]).map(mapPromptTemplate), options);
  const pageTemplates = filtered.slice(pagination.from, pagination.to);

  return {
    templates: pageTemplates,
    page: pagination.page,
    limit: pagination.limit,
    total: filtered.length,
    hasNext: pagination.to < filtered.length,
  };
}

export async function adminGetPromptTemplateById(
  id: string,
): Promise<{ template: PromptTemplate | null; error?: string }> {
  if (!import.meta.env.SSR || !supabaseAdmin) {
    return { template: null, error: 'Supabase admin client is not configured.' };
  }

  const { data, error } = await supabaseAdmin
    .from('ai_prompt_templates')
    .select('*')
    .eq('id', id)
    .maybeSingle<PromptTemplateRow>();

  if (error) {
    return { template: null, error: error.message };
  }

  return { template: data ? mapPromptTemplate(data) : null };
}

export async function adminGetPromptTemplateByKey(
  templateKey: string,
  { includeInactive = false }: { includeInactive?: boolean } = {},
): Promise<{ template: PromptTemplate | null; error?: string }> {
  if (!import.meta.env.SSR || !supabaseAdmin) {
    return { template: null, error: 'Supabase admin client is not configured.' };
  }

  const normalizedKey = templateKey.trim();

  if (!normalizedKey) {
    return { template: null, error: 'Template key is required.' };
  }

  let query = supabaseAdmin
    .from('ai_prompt_templates')
    .select('*')
    .eq('template_key', normalizedKey);

  if (!includeInactive) {
    query = query.eq('is_active', true);
  }

  const { data, error } = await query.maybeSingle<PromptTemplateRow>();

  if (error) {
    return { template: null, error: error.message };
  }

  return { template: data ? mapPromptTemplate(data) : null };
}

export async function adminCreatePromptTemplate(
  data: AdminPromptTemplateData,
): Promise<PromptTemplateMutationResult> {
  if (!import.meta.env.SSR || !supabaseAdmin) {
    return { success: false, error: 'Supabase admin client is not configured.' };
  }

  const payload = {
    ...getPayload(data),
    created_at: new Date().toISOString(),
  };
  const validationError = validatePayload(payload);

  if (validationError) {
    return { success: false, error: validationError };
  }

  try {
    if (await hasDuplicateTemplateKey(String(payload.template_key))) {
      return { success: false, error: 'A prompt template with this key already exists.' };
    }
  } catch (duplicateError) {
    return {
      success: false,
      error: duplicateError instanceof Error ? duplicateError.message : 'Unable to validate template key.',
    };
  }

  const { error } = await supabaseAdmin.from('ai_prompt_templates').insert(payload);

  if (!error) {
    return { success: true };
  }

  if (!isSchemaColumnError(error.message)) {
    return { success: false, error: error.message };
  }

  const legacyPayload = {
    ...getPayload(data, false),
    created_at: new Date().toISOString(),
  };
  const { error: legacyError } = await supabaseAdmin.from('ai_prompt_templates').insert(legacyPayload);

  return legacyError ? { success: false, error: legacyError.message } : { success: true };
}

export async function adminUpdatePromptTemplate(
  id: string,
  data: AdminPromptTemplateData,
): Promise<PromptTemplateMutationResult> {
  if (!import.meta.env.SSR || !supabaseAdmin) {
    return { success: false, error: 'Supabase admin client is not configured.' };
  }

  const payload = getPayload(data);
  const validationError = validatePayload(payload);

  if (validationError) {
    return { success: false, error: validationError };
  }

  try {
    if (await hasDuplicateTemplateKey(String(payload.template_key), id)) {
      return { success: false, error: 'A prompt template with this key already exists.' };
    }
  } catch (duplicateError) {
    return {
      success: false,
      error: duplicateError instanceof Error ? duplicateError.message : 'Unable to validate template key.',
    };
  }

  const { error } = await supabaseAdmin.from('ai_prompt_templates').update(payload).eq('id', id);

  if (!error) {
    return { success: true };
  }

  if (!isSchemaColumnError(error.message)) {
    return { success: false, error: error.message };
  }

  const { error: legacyError } = await supabaseAdmin
    .from('ai_prompt_templates')
    .update(getPayload(data, false))
    .eq('id', id);

  return legacyError ? { success: false, error: legacyError.message } : { success: true };
}

export async function adminDeletePromptTemplate(id: string): Promise<PromptTemplateMutationResult> {
  if (!import.meta.env.SSR || !supabaseAdmin) {
    return { success: false, error: 'Supabase admin client is not configured.' };
  }

  const { error } = await supabaseAdmin
    .from('ai_prompt_templates')
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq('id', id);

  return error ? { success: false, error: error.message } : { success: true };
}

const stringifyPromptValue = (value: PromptVariableValue) => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item)).join(', ');
  }

  if (value === null || value === undefined) {
    return '';
  }

  return String(value);
};

const renderTemplateString = (content: string | null, variables: PromptTemplateVariables) =>
  (content ?? '').replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_match, key: string) =>
    stringifyPromptValue(variables[key]),
  );

export function renderPromptTemplate(
  template: PromptTemplate,
  variables: PromptTemplateVariables,
) {
  return {
    systemPrompt: renderTemplateString(template.systemPrompt, variables),
    userPrompt: renderTemplateString(template.userPrompt, variables),
  };
}
