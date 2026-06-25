import { hasSupabaseEnv, supabase } from './supabase';

type PromptVariableValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | Array<string | number | boolean>;

export type PromptVariables = Record<string, PromptVariableValue>;

export interface AiPromptTemplate {
  id: string;
  templateKey: string;
  name: string;
  systemPrompt: string | null;
  userPrompt: string;
  isActive: boolean;
  createdAt: string | null;
  updatedAt: string | null;
}

interface AiPromptTemplateRow {
  id: string;
  template_key: string;
  name: string;
  system_prompt: string | null;
  user_prompt: string;
  is_active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

const fallbackTemplates: Record<string, AiPromptTemplate> = {
  game_seo_description: {
    id: 'game_seo_description',
    templateKey: 'game_seo_description',
    name: 'Game SEO Description',
    systemPrompt:
      'You are an SEO content writer for a browser games website. Write original, helpful, concise content. Do not claim ownership of third-party games. Avoid keyword stuffing.',
    userPrompt: `Write a unique SEO meta description for this game.
Game title: {{title}}
Category: {{category}}
Current short description: {{shortDescription}}
Requirements:
- 140 to 160 characters
- Return only plain text
- No HTML
- Include the game title naturally
- Mention free online browser game naturally`,
    isActive: true,
    createdAt: null,
    updatedAt: null,
  },
  game_article: {
    id: 'game_article',
    templateKey: 'game_article',
    name: 'Game Article',
    systemPrompt:
      'You are an SEO content writer for a browser games website. Write original, useful content for players. Do not copy other websites. Do not claim ownership of third-party games.',
    userPrompt: `Write an SEO-friendly article for this game.
Game title: {{title}}
Category: {{category}}
Tags: {{tags}}
Current description: {{description}}

Requirements:
- Return clean HTML only.
- Do not wrap output in markdown code fences.
- Do not include <html>, <head>, or <body>.
- Use only: <h2>, <h3>, <p>, <ul>, <ol>, <li>, <strong>, <em>.
- Do not use <h1>.
- Do not use inline styles.
- Do not use script, iframe, image, form, or button tags.
- Article length: 500-900 words if possible.
- The article should be original, helpful, and suitable for SEO.
- Do not claim that Free Game Zone owns the game.
- Do not copy from other websites.

Structure:
<h2>About {{title}}</h2>
<p>...</p>
<h2>How to play {{title}}</h2>
<p>...</p>
<h2>Game features</h2>
<ul>
  <li>...</li>
</ul>
<h2>Why play {{title}}?</h2>
<p>...</p>`,
    isActive: true,
    createdAt: null,
    updatedAt: null,
  },
  category_description: {
    id: 'category_description',
    templateKey: 'category_description',
    name: 'Category Description',
    systemPrompt: 'You are an SEO content writer for a browser games website.',
    userPrompt: `Write an SEO-friendly category description.
Category name: {{categoryName}}
Requirements:
- 250-400 words
- Explain what players can expect
- Mention online browser games naturally
- No keyword stuffing.`,
    isActive: true,
    createdAt: null,
    updatedAt: null,
  },
};

const mapPromptTemplate = (template: AiPromptTemplateRow): AiPromptTemplate => ({
  id: template.id,
  templateKey: template.template_key,
  name: template.name,
  systemPrompt: template.system_prompt,
  userPrompt: template.user_prompt,
  isActive: template.is_active !== false,
  createdAt: template.created_at,
  updatedAt: template.updated_at,
});

export async function getPromptTemplate(
  templateKey: string,
): Promise<AiPromptTemplate | null> {
  const normalizedKey = templateKey.trim();

  if (!normalizedKey) {
    return null;
  }

  if (hasSupabaseEnv && supabase) {
    const { data, error } = await supabase
      .from('ai_prompt_templates')
      .select('*')
      .eq('template_key', normalizedKey)
      .eq('is_active', true)
      .maybeSingle<AiPromptTemplateRow>();

    if (!error && data) {
      return mapPromptTemplate(data);
    }
  }

  return fallbackTemplates[normalizedKey] ?? null;
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

const renderTemplateString = (content: string, variables: PromptVariables) =>
  content.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_match, key: string) =>
    stringifyPromptValue(variables[key]),
  );

export function renderPromptTemplate(
  template: AiPromptTemplate,
  variables: PromptVariables,
) {
  return {
    system: template.systemPrompt
      ? renderTemplateString(template.systemPrompt, variables)
      : undefined,
    prompt: renderTemplateString(template.userPrompt, variables),
  };
}
