globalThis.process ??= {}; globalThis.process.env ??= {};
import { s as supabaseAdmin } from './supabase_C3sp2Zx_.mjs';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 40;
const MAX_LIMIT = 100;
const normalizePagination = ({
  page = DEFAULT_PAGE,
  limit = DEFAULT_LIMIT
} = {}) => {
  const safePage = Number.isFinite(page) ? Math.max(1, Math.trunc(page)) : DEFAULT_PAGE;
  const safeLimit = Number.isFinite(limit) ? Math.min(MAX_LIMIT, Math.max(1, Math.trunc(limit))) : DEFAULT_LIMIT;
  const from = (safePage - 1) * safeLimit;
  return { page: safePage, limit: safeLimit, from, to: from + safeLimit };
};
const normalizeText = (value) => value?.trim() ?? "";
const templateKeyPattern = /^[a-z0-9_]+$/;
const normalizeVariables = (variables) => {
  if (!Array.isArray(variables)) {
    return [];
  }
  return [
    ...new Set(
      variables.map((variable) => String(variable).trim()).filter(Boolean)
    )
  ];
};
const mapPromptTemplate = (template) => ({
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
  updatedAt: template.updated_at
});
const isSchemaColumnError = (errorMessage) => errorMessage.includes("Could not find") || errorMessage.includes("column") || errorMessage.includes("schema cache");
const getPayload = (data, includeExtendedColumns = true) => {
  const targetType = normalizeText(data.targetType);
  const action = normalizeText(data.action);
  const payload = {
    template_key: normalizeText(data.templateKey),
    name: normalizeText(data.name),
    system_prompt: normalizeText(data.systemPrompt) || null,
    user_prompt: normalizeText(data.userPrompt),
    is_active: data.isActive ?? true,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  if (includeExtendedColumns) {
    payload.description = normalizeText(data.description) || null;
    payload.target_type = targetType || null;
    payload.action = action || null;
    payload.variables = normalizeVariables(data.variables);
  }
  return payload;
};
const validatePayload = (payload) => {
  if (!payload.template_key) {
    return "Template key is required.";
  }
  if (typeof payload.template_key === "string" && !templateKeyPattern.test(payload.template_key)) {
    return "Template key must use lowercase letters, numbers, and underscores only.";
  }
  if (!payload.name) {
    return "Name is required.";
  }
  if (!payload.target_type) {
    return "Target type is required.";
  }
  if (!payload.action) {
    return "Action is required.";
  }
  if (!payload.user_prompt) {
    return "User prompt is required.";
  }
  return "";
};
const filterTemplates = (templates, { targetType = "", action = "", search = "" }) => {
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
    return [template.name, template.templateKey, template.description ?? ""].join(" ").toLowerCase().includes(normalizedSearch);
  });
};
const hasDuplicateTemplateKey = async (templateKey, currentId) => {
  if (!supabaseAdmin) {
    return false;
  }
  let query = supabaseAdmin.from("ai_prompt_templates").select("id").eq("template_key", templateKey).limit(1);
  if (currentId) {
    query = query.neq("id", currentId);
  }
  const { data, error } = await query;
  if (error) {
    throw new Error(error.message);
  }
  return Boolean(data?.length);
};
async function adminListPromptTemplates(options = {}) {
  const pagination = normalizePagination(options);
  if (!supabaseAdmin) {
    return {
      templates: [],
      page: pagination.page,
      limit: pagination.limit,
      total: 0,
      hasNext: false,
      error: "Supabase admin client is not configured."
    };
  }
  const { data, error } = await supabaseAdmin.from("ai_prompt_templates").select("*").order("created_at", { ascending: false }).limit(500);
  if (error) {
    return {
      templates: [],
      page: pagination.page,
      limit: pagination.limit,
      total: 0,
      hasNext: false,
      error: error.message
    };
  }
  const filtered = filterTemplates((data ?? []).map(mapPromptTemplate), options);
  const pageTemplates = filtered.slice(pagination.from, pagination.to);
  return {
    templates: pageTemplates,
    page: pagination.page,
    limit: pagination.limit,
    total: filtered.length,
    hasNext: pagination.to < filtered.length
  };
}
async function adminGetPromptTemplateById(id) {
  if (!supabaseAdmin) {
    return { template: null, error: "Supabase admin client is not configured." };
  }
  const { data, error } = await supabaseAdmin.from("ai_prompt_templates").select("*").eq("id", id).maybeSingle();
  if (error) {
    return { template: null, error: error.message };
  }
  return { template: data ? mapPromptTemplate(data) : null };
}
async function adminGetPromptTemplateByKey(templateKey, { includeInactive = false } = {}) {
  if (!supabaseAdmin) {
    return { template: null, error: "Supabase admin client is not configured." };
  }
  const normalizedKey = templateKey.trim();
  if (!normalizedKey) {
    return { template: null, error: "Template key is required." };
  }
  let query = supabaseAdmin.from("ai_prompt_templates").select("*").eq("template_key", normalizedKey);
  if (!includeInactive) {
    query = query.eq("is_active", true);
  }
  const { data, error } = await query.maybeSingle();
  if (error) {
    return { template: null, error: error.message };
  }
  return { template: data ? mapPromptTemplate(data) : null };
}
async function adminCreatePromptTemplate(data) {
  if (!supabaseAdmin) {
    return { success: false, error: "Supabase admin client is not configured." };
  }
  const payload = {
    ...getPayload(data),
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  const validationError = validatePayload(payload);
  if (validationError) {
    return { success: false, error: validationError };
  }
  try {
    if (await hasDuplicateTemplateKey(String(payload.template_key))) {
      return { success: false, error: "A prompt template with this key already exists." };
    }
  } catch (duplicateError) {
    return {
      success: false,
      error: duplicateError instanceof Error ? duplicateError.message : "Unable to validate template key."
    };
  }
  const { error } = await supabaseAdmin.from("ai_prompt_templates").insert(payload);
  if (!error) {
    return { success: true };
  }
  if (!isSchemaColumnError(error.message)) {
    return { success: false, error: error.message };
  }
  const legacyPayload = {
    ...getPayload(data, false),
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  const { error: legacyError } = await supabaseAdmin.from("ai_prompt_templates").insert(legacyPayload);
  return legacyError ? { success: false, error: legacyError.message } : { success: true };
}
async function adminUpdatePromptTemplate(id, data) {
  if (!supabaseAdmin) {
    return { success: false, error: "Supabase admin client is not configured." };
  }
  const payload = getPayload(data);
  const validationError = validatePayload(payload);
  if (validationError) {
    return { success: false, error: validationError };
  }
  try {
    if (await hasDuplicateTemplateKey(String(payload.template_key), id)) {
      return { success: false, error: "A prompt template with this key already exists." };
    }
  } catch (duplicateError) {
    return {
      success: false,
      error: duplicateError instanceof Error ? duplicateError.message : "Unable to validate template key."
    };
  }
  const { error } = await supabaseAdmin.from("ai_prompt_templates").update(payload).eq("id", id);
  if (!error) {
    return { success: true };
  }
  if (!isSchemaColumnError(error.message)) {
    return { success: false, error: error.message };
  }
  const { error: legacyError } = await supabaseAdmin.from("ai_prompt_templates").update(getPayload(data, false)).eq("id", id);
  return legacyError ? { success: false, error: legacyError.message } : { success: true };
}
async function adminDeletePromptTemplate(id) {
  if (!supabaseAdmin) {
    return { success: false, error: "Supabase admin client is not configured." };
  }
  const { error } = await supabaseAdmin.from("ai_prompt_templates").update({ is_active: false, updated_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", id);
  return error ? { success: false, error: error.message } : { success: true };
}
const stringifyPromptValue = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item)).join(", ");
  }
  if (value === null || value === void 0) {
    return "";
  }
  return String(value);
};
const renderTemplateString = (content, variables) => (content ?? "").replace(
  /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g,
  (_match, key) => stringifyPromptValue(variables[key])
);
function renderPromptTemplate(template, variables) {
  return {
    systemPrompt: renderTemplateString(template.systemPrompt, variables),
    userPrompt: renderTemplateString(template.userPrompt, variables)
  };
}

export { adminGetPromptTemplateByKey as a, adminCreatePromptTemplate as b, adminGetPromptTemplateById as c, adminDeletePromptTemplate as d, adminUpdatePromptTemplate as e, adminListPromptTemplates as f, renderPromptTemplate as r };
