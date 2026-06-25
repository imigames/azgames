globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as generateAiText } from '../../../chunks/ai-client_GU1hroY7.mjs';
import { b as adminCreateGenerationLog } from '../../../chunks/ai-providers_Dsks5SxJ.mjs';
import { a as adminGetPromptTemplateByKey, r as renderPromptTemplate } from '../../../chunks/prompt-templates_CUEdmw4k.mjs';
import { c as createSupabaseServerClient } from '../../../chunks/supabase_C3sp2Zx_.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const ACCESS_COOKIE = "admin-access-token";
const REFRESH_COOKIE = "admin-refresh-token";
const PROMPT_TEMPLATE_ERROR = "Prompt template is missing or inactive. Please check Prompt Templates.";
const NO_PROVIDER_ERROR = "No AI provider is configured. Please configure one in Ai Models.";
const actionTemplateMap = {
  generate_article: "game_article",
  generate_meta_description: "game_seo_description",
  game_article: "game_article",
  game_seo_description: "game_seo_description"
};
const adminEmails = [];
const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: {
    "content-type": "application/json"
  }
});
const normalizeText = (value) => typeof value === "string" ? value.trim() : "";
const normalizeTags = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean).slice(0, 12);
  }
  if (typeof value === "string") {
    return value.split(",").map((tag) => tag.trim()).filter(Boolean).slice(0, 12);
  }
  return [];
};
const escapeHtml = (value) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
const inlineMarkdown = (value) => escapeHtml(value).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/\*([^*]+)\*/g, "<em>$1</em>");
const normalizeGeneratedArticleHtml = (text) => {
  const trimmedText = text.trim();
  if (/<\s*(h2|h3|p|ul|ol|li|blockquote|strong|em|a|br)\b/i.test(trimmedText)) {
    return trimmedText;
  }
  const lines = trimmedText.split(/\r?\n/);
  const output = [];
  let listType = null;
  const closeList = () => {
    if (listType) {
      output.push(`</${listType}>`);
      listType = null;
    }
  };
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      closeList();
      continue;
    }
    if (line.startsWith("### ")) {
      closeList();
      output.push(`<h3>${inlineMarkdown(line.slice(4))}</h3>`);
      continue;
    }
    if (line.startsWith("## ")) {
      closeList();
      output.push(`<h2>${inlineMarkdown(line.slice(3))}</h2>`);
      continue;
    }
    const bullet = line.match(/^[-*]\s+(.+)$/);
    if (bullet) {
      if (listType !== "ul") {
        closeList();
        output.push("<ul>");
        listType = "ul";
      }
      output.push(`<li>${inlineMarkdown(bullet[1])}</li>`);
      continue;
    }
    const ordered = line.match(/^\d+\.\s+(.+)$/);
    if (ordered) {
      if (listType !== "ol") {
        closeList();
        output.push("<ol>");
        listType = "ol";
      }
      output.push(`<li>${inlineMarkdown(ordered[1])}</li>`);
      continue;
    }
    closeList();
    output.push(`<p>${inlineMarkdown(line)}</p>`);
  }
  closeList();
  return output.join("\n");
};
const requireAdmin = async (context) => {
  const accessToken = context.cookies.get(ACCESS_COOKIE)?.value;
  const refreshToken = context.cookies.get(REFRESH_COOKIE)?.value;
  if (!accessToken || !refreshToken) {
    return false;
  }
  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return false;
  }
  const { data, error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken
  });
  if (error || !data.user) {
    return false;
  }
  return adminEmails.length === 0 || adminEmails.includes(data.user.email?.toLowerCase() ?? "");
};
const POST = async (context) => {
  if (!await requireAdmin(context)) {
    return json({ ok: false, message: "Unauthorized." }, 401);
  }
  let payload;
  try {
    payload = await context.request.json();
  } catch {
    return json({ ok: false, message: "Invalid JSON payload." }, 400);
  }
  const action = normalizeText(payload.action);
  const templateKey = actionTemplateMap[action];
  if (!templateKey) {
    return json({ ok: false, message: "Invalid AI generation action." }, 400);
  }
  const publicAction = templateKey === "game_article" ? "generate_article" : "generate_meta_description";
  const targetId = normalizeText(payload.gameId) || normalizeText(payload.id) || void 0;
  const targetSlug = normalizeText(payload.targetSlug) || normalizeText(payload.slug) || void 0;
  const title = normalizeText(payload.title);
  const category = normalizeText(payload.category) || "Uncategorized";
  const article = normalizeText(payload.article) || normalizeText(payload.description);
  const seoDescription = normalizeText(payload.seoDescription);
  const tags = normalizeTags(payload.tags);
  if (!title) {
    return json({ ok: false, message: "Title is required before generating content." }, 400);
  }
  const { template, error: templateError } = await adminGetPromptTemplateByKey(templateKey);
  if (templateError || !template) {
    await adminCreateGenerationLog({
      targetType: "game",
      targetId,
      targetSlug,
      action: publicAction,
      status: "error",
      errorMessage: PROMPT_TEMPLATE_ERROR
    });
    return json({ ok: false, message: PROMPT_TEMPLATE_ERROR }, 400);
  }
  const renderedPrompt = renderPromptTemplate(template, {
    title,
    category,
    shortDescription: seoDescription,
    seoDescription,
    description: article,
    article,
    instructions: "",
    tags
  });
  const outputHint = templateKey === "game_article" ? "\n\nReturn safe HTML only. Use only h2, h3, p, ul, ol, li, strong, em, a, br, and blockquote tags. Do not include h1, script, iframe, style, form, input, button, or img tags." : "\n\nReturn only the meta description text.";
  const prompt = `${renderedPrompt.userPrompt}${outputHint}`;
  try {
    const generated = await generateAiText({
      system: renderedPrompt.systemPrompt,
      prompt,
      maxTokens: templateKey === "game_article" ? 1e3 : 220,
      temperature: 0.65
    });
    const text = templateKey === "game_article" ? normalizeGeneratedArticleHtml(generated.text) : generated.text.trim().replace(/^["']|["']$/g, "");
    await adminCreateGenerationLog({
      providerKey: generated.providerKey,
      model: generated.model,
      targetType: "game",
      targetId,
      targetSlug,
      action: publicAction,
      prompt: renderedPrompt.userPrompt,
      result: text,
      status: "success"
    });
    return json({ ok: true, text });
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI generation failed.";
    const safeMessage = message === "No AI provider is configured." ? NO_PROVIDER_ERROR : message;
    await adminCreateGenerationLog({
      targetType: "game",
      targetId,
      targetSlug,
      action: publicAction,
      prompt: renderedPrompt.userPrompt,
      status: "error",
      errorMessage: safeMessage
    });
    return json({ ok: false, message: safeMessage }, 500);
  }
};
const ALL = () => json({ ok: false, message: "Method not allowed." }, 405);

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  ALL,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
