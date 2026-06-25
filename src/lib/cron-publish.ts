import { adminCreateGenerationLog } from './ai-providers';
import { generateAiText } from './ai-client';
import { htmlToPlainText, sanitizeGameArticleHtml } from './html-sanitize';
import { adminGetPromptTemplateByKey, renderPromptTemplate } from './prompt-templates';
import { supabaseAdmin } from './supabase';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 40;
const MAX_LIMIT = 100;
const SETTINGS_KEYS = {
  enabled: 'cron_publish_enabled',
  batchSize: 'cron_publish_batch_size',
  maxPerDay: 'cron_publish_max_per_day',
  intervalLabel: 'cron_publish_interval_label',
  requireArticle: 'cron_publish_require_article',
  requireMetaDescription: 'cron_publish_require_meta_description',
  articleMaxTokens: 'cron_publish_article_max_tokens',
  metaDescriptionMaxTokens: 'cron_publish_meta_description_max_tokens',
  categoryFilter: 'cron_publish_category_filter',
  lastRunAt: 'cron_publish_last_run_at',
  todayCount: 'cron_publish_today_count',
  todayDate: 'cron_publish_today_date',
} as const;

export interface CronPublishSettings {
  enabled: boolean;
  batchSize: number;
  maxPerDay: number;
  intervalLabel: string;
  requireArticle: boolean;
  requireMetaDescription: boolean;
  articleMaxTokens: number;
  metaDescriptionMaxTokens: number;
  categoryFilter: string;
  lastRunAt: string;
  todayCount: number;
  todayDate: string;
}

export interface CronPublishSettingsUpdate {
  enabled?: boolean;
  batchSize?: number;
  maxPerDay?: number;
  intervalLabel?: string;
  requireArticle?: boolean;
  requireMetaDescription?: boolean;
  articleMaxTokens?: number;
  metaDescriptionMaxTokens?: number;
  categoryFilter?: string;
}

export interface CronInactiveGame {
  id: string;
  title: string;
  slug: string;
  categorySlug: string | null;
  thumbnail: string | null;
  iframeUrl: string | null;
  seoDescription: string | null;
  description: string | null;
  createdAt: string | null;
  hasArticle: boolean;
  hasMetaDescription: boolean;
}

export interface CronPublishLog {
  id: string;
  runId: string;
  gameId: string | null;
  gameSlug: string | null;
  status: string;
  step: string | null;
  message: string | null;
  articleGenerated: boolean;
  metaDescriptionGenerated: boolean;
  published: boolean;
  errorMessage: string | null;
  createdAt: string | null;
}

export interface CronListOptions {
  page?: number;
  limit?: number;
  search?: string;
  categorySlug?: string;
  contentStatus?: 'all' | 'ready' | 'missing_article' | 'missing_meta';
}

export interface CronPublishSummary {
  processed: number;
  published: number;
  failed: number;
  skipped: number;
  runId: string;
  message?: string;
  error?: string;
}

export interface CronPublishStats {
  inactiveGamesCount: number;
  readyToPublishCount: number;
  missingArticleCount: number;
  missingMetaDescriptionCount: number;
  publishedTodayCount: number;
  lastRunAt: string;
}

type CronPublishSource = 'manual' | 'cron';

interface SettingRow {
  key: string;
  value: string | null;
  value_type: string | null;
}

interface CronInactiveGameRow {
  id: string;
  title: string;
  slug: string;
  category_slug: string | null;
  thumbnail: string | null;
  iframe_url: string | null;
  seo_description: string | null;
  description: string | null;
  created_at: string | null;
}

interface CronPublishLogRow {
  id: string;
  run_id: string;
  game_id: string | null;
  game_slug: string | null;
  status: string;
  step: string | null;
  message: string | null;
  article_generated: boolean | null;
  meta_description_generated: boolean | null;
  published: boolean | null;
  error_message: string | null;
  created_at: string | null;
}

interface CategoryRow {
  slug: string;
  name: string;
}

const DEFAULT_SETTINGS: CronPublishSettings = {
  enabled: false,
  batchSize: 2,
  maxPerDay: 20,
  intervalLabel: 'Every 1 hour',
  requireArticle: true,
  requireMetaDescription: true,
  articleMaxTokens: 900,
  metaDescriptionMaxTokens: 180,
  categoryFilter: 'all',
  lastRunAt: '',
  todayCount: 0,
  todayDate: '',
};

const isConfigured = () => import.meta.env.SSR && Boolean(supabaseAdmin);

const getConfigError = () => 'Supabase admin client is not configured.';

const clampInt = (value: number, min: number, max: number, fallback: number) => {
  if (!Number.isFinite(value)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, Math.trunc(value)));
};

const parseBoolean = (value: string | null | undefined, fallback: boolean) => {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }

  return value === 'true' || value === '1' || value.toLowerCase() === 'yes';
};

const parseNumber = (value: string | null | undefined, fallback: number) => {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

const getFriendlyAiErrorMessage = (message = '') => {
  const normalized = message.toLowerCase();
  const mentionsCredits = normalized.includes('credit') || normalized.includes('afford');
  const mentionsTokens =
    normalized.includes('max_tokens')
    || normalized.includes('max tokens')
    || normalized.includes('token');

  if (
    normalized.includes('fewer max_tokens')
    || normalized.includes('insufficient credits')
    || (mentionsCredits && mentionsTokens)
  ) {
    return 'AI generation failed because the provider has insufficient credits or max tokens are too high.';
  }

  return message || 'AI generation failed.';
};

const getTodayKey = () => new Date().toISOString().slice(0, 10);

const normalizePagination = ({ page = DEFAULT_PAGE, limit = DEFAULT_LIMIT }: CronListOptions = {}) => {
  const safePage = Number.isFinite(page) ? Math.max(1, Math.trunc(page)) : DEFAULT_PAGE;
  const safeLimit = Number.isFinite(limit)
    ? Math.min(MAX_LIMIT, Math.max(1, Math.trunc(limit)))
    : DEFAULT_LIMIT;
  const from = (safePage - 1) * safeLimit;

  return { page: safePage, limit: safeLimit, from, to: from + safeLimit - 1 };
};

const escapeSearchValue = (value: string) =>
  value.replaceAll('%', '\\%').replaceAll('_', '\\_').replaceAll(',', '\\,');

const hasText = (value: string | null | undefined) => Boolean(value?.trim());

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const stripMarkdownFences = (value: string) =>
  value
    .trim()
    .replace(/^```(?:html|markdown|md|text)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

const inlineMarkdownToHtml = (value: string) =>
  escapeHtml(value)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');

const markdownToSafeHtml = (value: string) => {
  const lines = value.split(/\r?\n/);
  const output: string[] = [];
  let listType: 'ul' | 'ol' | null = null;

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

    if (line.startsWith('# ')) {
      closeList();
      output.push(`<h2>${inlineMarkdownToHtml(line.slice(2))}</h2>`);
      continue;
    }

    if (line.startsWith('## ')) {
      closeList();
      output.push(`<h2>${inlineMarkdownToHtml(line.slice(3))}</h2>`);
      continue;
    }

    if (line.startsWith('### ')) {
      closeList();
      output.push(`<h3>${inlineMarkdownToHtml(line.slice(4))}</h3>`);
      continue;
    }

    const unordered = line.match(/^[-*]\s+(.+)$/);

    if (unordered) {
      if (listType !== 'ul') {
        closeList();
        output.push('<ul>');
        listType = 'ul';
      }

      output.push(`<li>${inlineMarkdownToHtml(unordered[1])}</li>`);
      continue;
    }

    const ordered = line.match(/^\d+\.\s+(.+)$/);

    if (ordered) {
      if (listType !== 'ol') {
        closeList();
        output.push('<ol>');
        listType = 'ol';
      }

      output.push(`<li>${inlineMarkdownToHtml(ordered[1])}</li>`);
      continue;
    }

    closeList();
    output.push(`<p>${inlineMarkdownToHtml(line)}</p>`);
  }

  closeList();
  return output.join('\n');
};

const normalizeGeneratedArticle = (value: string) => {
  const stripped = stripMarkdownFences(value);
  const html = /<\s*(h1|h2|h3|p|ul|ol|li|blockquote|strong|em|a|br)\b/i.test(stripped)
    ? stripped
    : markdownToSafeHtml(stripped);

  return sanitizeGameArticleHtml(html).trim();
};

const normalizeGeneratedMetaDescription = (value: string) => {
  const plainText = htmlToPlainText(stripMarkdownFences(value))
    .replace(/^["']|["']$/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (plainText.length <= 170) {
    return plainText;
  }

  const truncated = plainText.slice(0, 170);
  const lastSpace = truncated.lastIndexOf(' ');
  const end = lastSpace > 139 ? lastSpace : 170;
  return `${truncated.slice(0, end).trim().replace(/[.,;:!?-]+$/, '')}.`;
};

const createRunId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const mapInactiveGame = (game: CronInactiveGameRow): CronInactiveGame => ({
  id: game.id,
  title: game.title,
  slug: game.slug,
  categorySlug: game.category_slug,
  thumbnail: game.thumbnail,
  iframeUrl: game.iframe_url,
  seoDescription: game.seo_description,
  description: game.description,
  createdAt: game.created_at,
  hasArticle: hasText(game.description),
  hasMetaDescription: hasText(game.seo_description),
});

const mapCronLog = (log: CronPublishLogRow): CronPublishLog => ({
  id: log.id,
  runId: log.run_id,
  gameId: log.game_id,
  gameSlug: log.game_slug,
  status: log.status,
  step: log.step,
  message: log.message,
  articleGenerated: Boolean(log.article_generated),
  metaDescriptionGenerated: Boolean(log.meta_description_generated),
  published: Boolean(log.published),
  errorMessage: log.error_message,
  createdAt: log.created_at,
});

const settingsFromRows = (rows: SettingRow[]): CronPublishSettings => {
  const values = new Map(rows.map((row) => [row.key, row.value]));

  return {
    enabled: parseBoolean(values.get(SETTINGS_KEYS.enabled), DEFAULT_SETTINGS.enabled),
    batchSize: clampInt(
      parseNumber(values.get(SETTINGS_KEYS.batchSize), DEFAULT_SETTINGS.batchSize),
      1,
      10,
      DEFAULT_SETTINGS.batchSize,
    ),
    maxPerDay: clampInt(
      parseNumber(values.get(SETTINGS_KEYS.maxPerDay), DEFAULT_SETTINGS.maxPerDay),
      1,
      100,
      DEFAULT_SETTINGS.maxPerDay,
    ),
    intervalLabel: values.get(SETTINGS_KEYS.intervalLabel) || DEFAULT_SETTINGS.intervalLabel,
    requireArticle: parseBoolean(
      values.get(SETTINGS_KEYS.requireArticle),
      DEFAULT_SETTINGS.requireArticle,
    ),
    requireMetaDescription: parseBoolean(
      values.get(SETTINGS_KEYS.requireMetaDescription),
      DEFAULT_SETTINGS.requireMetaDescription,
    ),
    articleMaxTokens: clampInt(
      parseNumber(values.get(SETTINGS_KEYS.articleMaxTokens), DEFAULT_SETTINGS.articleMaxTokens),
      300,
      1500,
      DEFAULT_SETTINGS.articleMaxTokens,
    ),
    metaDescriptionMaxTokens: clampInt(
      parseNumber(
        values.get(SETTINGS_KEYS.metaDescriptionMaxTokens),
        DEFAULT_SETTINGS.metaDescriptionMaxTokens,
      ),
      80,
      300,
      DEFAULT_SETTINGS.metaDescriptionMaxTokens,
    ),
    categoryFilter: values.get(SETTINGS_KEYS.categoryFilter) || DEFAULT_SETTINGS.categoryFilter,
    lastRunAt: values.get(SETTINGS_KEYS.lastRunAt) || DEFAULT_SETTINGS.lastRunAt,
    todayCount: Math.max(
      0,
      parseNumber(values.get(SETTINGS_KEYS.todayCount), DEFAULT_SETTINGS.todayCount),
    ),
    todayDate: values.get(SETTINGS_KEYS.todayDate) || DEFAULT_SETTINGS.todayDate,
  };
};

const upsertSettings = async (values: Array<{ key: string; value: string; value_type: string }>) => {
  if (!supabaseAdmin) {
    return { success: false, error: getConfigError() };
  }

  const { error } = await supabaseAdmin.from('cron_publish_settings').upsert(
    values.map((setting) => ({
      ...setting,
      updated_at: new Date().toISOString(),
    })),
    { onConflict: 'key' },
  );

  return error ? { success: false, error: error.message } : { success: true };
};

const insertCronLog = async ({
  runId,
  gameId,
  gameSlug,
  status,
  step,
  message,
  articleGenerated = false,
  metaDescriptionGenerated = false,
  published = false,
  errorMessage,
}: {
  runId: string;
  gameId?: string | null;
  gameSlug?: string | null;
  status: string;
  step?: string;
  message?: string;
  articleGenerated?: boolean;
  metaDescriptionGenerated?: boolean;
  published?: boolean;
  errorMessage?: string;
}) => {
  if (!supabaseAdmin) {
    return;
  }

  await supabaseAdmin.from('cron_publish_logs').insert({
    run_id: runId,
    game_id: gameId ?? null,
    game_slug: gameSlug ?? null,
    status,
    step: step ?? null,
    message: message ?? null,
    article_generated: articleGenerated,
    meta_description_generated: metaDescriptionGenerated,
    published,
    error_message: errorMessage ?? null,
  });
};

const getCategoryName = async (categorySlug: string | null) => {
  if (!categorySlug || !supabaseAdmin) {
    return categorySlug ?? '';
  }

  const { data } = await supabaseAdmin
    .from('categories')
    .select('slug,name')
    .eq('slug', categorySlug)
    .maybeSingle<CategoryRow>();

  return data?.name ?? categorySlug;
};

const applyContentStatusFilter = <TQuery extends { not: Function; neq: Function; or: Function }>(
  query: TQuery,
  contentStatus: CronListOptions['contentStatus'] = 'all',
) => {
  if (contentStatus === 'ready') {
    return query
      .not('title', 'is', null)
      .neq('title', '')
      .not('slug', 'is', null)
      .neq('slug', '')
      .not('iframe_url', 'is', null)
      .neq('iframe_url', '')
      .not('thumbnail', 'is', null)
      .neq('thumbnail', '')
      .not('category_slug', 'is', null)
      .neq('category_slug', '');
  }

  if (contentStatus === 'missing_article') {
    return query.or('description.is.null,description.eq.');
  }

  if (contentStatus === 'missing_meta') {
    return query.or('seo_description.is.null,seo_description.eq.');
  }

  return query;
};

const countInactiveGames = async (contentStatus: CronListOptions['contentStatus'] = 'all') => {
  if (!supabaseAdmin) {
    return 0;
  }

  let query = supabaseAdmin
    .from('games')
    .select('id', { count: 'exact', head: true })
    .eq('is_active', false);

  query = applyContentStatusFilter(query, contentStatus);

  const { count, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return count ?? 0;
};

const hasDuplicateSlug = async (game: CronInactiveGame) => {
  if (!supabaseAdmin || !game.slug.trim()) {
    return false;
  }

  const { data, error } = await supabaseAdmin
    .from('games')
    .select('id')
    .eq('slug', game.slug)
    .neq('id', game.id)
    .limit(1);

  if (error) {
    throw new Error(error.message);
  }

  return Boolean(data?.length);
};

const getPublishBlockReason = async (
  game: CronInactiveGame,
  {
    requireArticle,
    requireMetaDescription,
    article,
    metaDescription,
  }: {
    requireArticle: boolean;
    requireMetaDescription: boolean;
    article: string | null | undefined;
    metaDescription: string | null | undefined;
  },
) => {
  if (!hasText(game.title)) {
    return 'Title is required before publishing.';
  }

  if (!hasText(game.slug)) {
    return 'Slug is required before publishing.';
  }

  if (await hasDuplicateSlug(game)) {
    return 'Duplicate slug detected. Game was not published.';
  }

  if (!hasText(game.iframeUrl)) {
    return 'Iframe URL is required before publishing.';
  }

  if (!hasText(game.thumbnail)) {
    return 'Thumbnail is required before publishing.';
  }

  if (!hasText(game.categorySlug)) {
    return 'Category is required before publishing.';
  }

  if (requireArticle && !hasText(article)) {
    return 'Article is required before publishing.';
  }

  if (requireMetaDescription && !hasText(metaDescription)) {
    return 'SEO meta description is required before publishing.';
  }

  return '';
};

const generateGameContent = async ({
  game,
  templateKey,
  action,
  runId,
  temperature,
  maxTokens,
}: {
  game: CronInactiveGame;
  templateKey: 'game_article' | 'game_seo_description';
  action: 'cron_generate_article' | 'cron_generate_meta_description';
  runId: string;
  temperature: number;
  maxTokens: number;
}) => {
  const { template, error } = await adminGetPromptTemplateByKey(templateKey);

  if (error || !template) {
    throw new Error('Prompt template is missing or inactive. Please check Prompt Templates.');
  }

  const category = await getCategoryName(game.categorySlug);
  const rendered = renderPromptTemplate(template, {
    title: game.title,
    category,
    categorySlug: game.categorySlug ?? '',
    shortDescription: game.seoDescription ?? '',
    seoDescription: game.seoDescription ?? '',
    description: game.description ?? '',
    article: game.description ?? '',
    instructions: '',
    tags: [],
  });

  try {
    const generated = await generateAiText({
      system: rendered.systemPrompt,
      prompt: rendered.userPrompt,
      temperature,
      maxTokens,
    });

    await adminCreateGenerationLog({
      providerKey: generated.providerKey,
      model: generated.model,
      targetType: 'game',
      targetId: game.id,
      targetSlug: game.slug,
      action,
      prompt: rendered.userPrompt,
      result: templateKey === 'game_article'
        ? normalizeGeneratedArticle(generated.text)
        : normalizeGeneratedMetaDescription(generated.text),
      status: 'success',
    });

    return templateKey === 'game_article'
      ? normalizeGeneratedArticle(generated.text)
      : normalizeGeneratedMetaDescription(generated.text);
  } catch (generationError) {
    const errorMessage = getFriendlyAiErrorMessage(
      generationError instanceof Error ? generationError.message : 'AI generation failed.',
    );

    await adminCreateGenerationLog({
      targetType: 'game',
      targetId: game.id,
      targetSlug: game.slug,
      action,
      prompt: rendered.userPrompt,
      status: 'error',
      errorMessage,
    });

    await insertCronLog({
      runId,
      gameId: game.id,
      gameSlug: game.slug,
      status: 'error',
      step: action,
      message: 'AI generation failed.',
      errorMessage,
    });

    throw new Error(errorMessage);
  }
};

export async function adminGetCronPublishSettings(): Promise<{
  settings: CronPublishSettings;
  error?: string;
}> {
  if (!isConfigured() || !supabaseAdmin) {
    return { settings: DEFAULT_SETTINGS, error: getConfigError() };
  }

  const { data, error } = await supabaseAdmin
    .from('cron_publish_settings')
    .select('key,value,value_type');

  if (error) {
    return { settings: DEFAULT_SETTINGS, error: error.message };
  }

  return { settings: settingsFromRows((data ?? []) as SettingRow[]) };
}

export async function adminUpdateCronPublishSettings(
  settings: CronPublishSettingsUpdate,
): Promise<{ success: boolean; error?: string }> {
  if (!isConfigured()) {
    return { success: false, error: getConfigError() };
  }

  const updates: Array<{ key: string; value: string; value_type: string }> = [];

  if (settings.enabled !== undefined) {
    updates.push({
      key: SETTINGS_KEYS.enabled,
      value: String(Boolean(settings.enabled)),
      value_type: 'boolean',
    });
  }

  if (settings.batchSize !== undefined) {
    updates.push({
      key: SETTINGS_KEYS.batchSize,
      value: String(clampInt(settings.batchSize, 1, 10, DEFAULT_SETTINGS.batchSize)),
      value_type: 'number',
    });
  }

  if (settings.maxPerDay !== undefined) {
    updates.push({
      key: SETTINGS_KEYS.maxPerDay,
      value: String(clampInt(settings.maxPerDay, 1, 100, DEFAULT_SETTINGS.maxPerDay)),
      value_type: 'number',
    });
  }

  if (settings.intervalLabel !== undefined) {
    updates.push({
      key: SETTINGS_KEYS.intervalLabel,
      value: settings.intervalLabel.trim() || DEFAULT_SETTINGS.intervalLabel,
      value_type: 'text',
    });
  }

  if (settings.requireArticle !== undefined) {
    updates.push({
      key: SETTINGS_KEYS.requireArticle,
      value: String(Boolean(settings.requireArticle)),
      value_type: 'boolean',
    });
  }

  if (settings.requireMetaDescription !== undefined) {
    updates.push({
      key: SETTINGS_KEYS.requireMetaDescription,
      value: String(Boolean(settings.requireMetaDescription)),
      value_type: 'boolean',
    });
  }

  if (settings.articleMaxTokens !== undefined) {
    updates.push({
      key: SETTINGS_KEYS.articleMaxTokens,
      value: String(
        clampInt(settings.articleMaxTokens, 300, 1500, DEFAULT_SETTINGS.articleMaxTokens),
      ),
      value_type: 'number',
    });
  }

  if (settings.metaDescriptionMaxTokens !== undefined) {
    updates.push({
      key: SETTINGS_KEYS.metaDescriptionMaxTokens,
      value: String(
        clampInt(
          settings.metaDescriptionMaxTokens,
          80,
          300,
          DEFAULT_SETTINGS.metaDescriptionMaxTokens,
        ),
      ),
      value_type: 'number',
    });
  }

  if (settings.categoryFilter !== undefined) {
    updates.push({
      key: SETTINGS_KEYS.categoryFilter,
      value: settings.categoryFilter.trim() || DEFAULT_SETTINGS.categoryFilter,
      value_type: 'text',
    });
  }

  if (updates.length === 0) {
    return { success: true };
  }

  return upsertSettings(updates);
}

export async function adminListInactiveGamesForCron({
  page,
  limit,
  search = '',
  categorySlug = '',
  contentStatus = 'all',
}: CronListOptions = {}): Promise<{
  games: CronInactiveGame[];
  page: number;
  limit: number;
  total: number;
  hasNext: boolean;
  error?: string;
}> {
  const pagination = normalizePagination({ page, limit });

  if (!isConfigured() || !supabaseAdmin) {
    return {
      games: [],
      page: pagination.page,
      limit: pagination.limit,
      total: 0,
      hasNext: false,
      error: getConfigError(),
    };
  }

  let query = supabaseAdmin
    .from('games')
    .select('id,title,slug,category_slug,thumbnail,iframe_url,seo_description,description,created_at', {
      count: 'exact',
    })
    .eq('is_active', false)
    .order('created_at', { ascending: true })
    .range(pagination.from, pagination.to);

  const normalizedSearch = search.trim();

  if (normalizedSearch) {
    const escapedSearch = escapeSearchValue(normalizedSearch);
    query = query.or(`title.ilike.%${escapedSearch}%,slug.ilike.%${escapedSearch}%`);
  }

  if (categorySlug) {
    query = query.eq('category_slug', categorySlug);
  }

  query = applyContentStatusFilter(query, contentStatus);

  const { data, error, count } = await query;

  if (error) {
    return {
      games: [],
      page: pagination.page,
      limit: pagination.limit,
      total: 0,
      hasNext: false,
      error: error.message,
    };
  }

  const total = count ?? 0;

  return {
    games: ((data ?? []) as CronInactiveGameRow[]).map(mapInactiveGame),
    page: pagination.page,
    limit: pagination.limit,
    total,
    hasNext: pagination.from + pagination.limit < total,
  };
}

export async function adminGetCronPublishStats(): Promise<{
  stats: CronPublishStats;
  error?: string;
}> {
  const { settings } = await adminGetCronPublishSettings();
  const fallbackStats = {
    inactiveGamesCount: 0,
    readyToPublishCount: 0,
    missingArticleCount: 0,
    missingMetaDescriptionCount: 0,
    publishedTodayCount: settings.todayCount,
    lastRunAt: settings.lastRunAt,
  };

  if (!isConfigured() || !supabaseAdmin) {
    return { stats: fallbackStats, error: getConfigError() };
  }

  try {
    const [inactiveGamesCount, readyToPublishCount, missingArticleCount, missingMetaDescriptionCount] =
      await Promise.all([
        countInactiveGames('all'),
        countInactiveGames('ready'),
        countInactiveGames('missing_article'),
        countInactiveGames('missing_meta'),
      ]);

    return {
      stats: {
        inactiveGamesCount,
        readyToPublishCount,
        missingArticleCount,
        missingMetaDescriptionCount,
        publishedTodayCount: settings.todayDate === getTodayKey() ? settings.todayCount : 0,
        lastRunAt: settings.lastRunAt,
      },
    };
  } catch (error) {
    return {
      stats: fallbackStats,
      error: error instanceof Error ? error.message : 'Unable to load Cron Publish stats.',
    };
  }
}

export async function adminGetCronPublishLogs({
  page,
  limit,
}: Pick<CronListOptions, 'page' | 'limit'> = {}): Promise<{
  logs: CronPublishLog[];
  page: number;
  limit: number;
  hasNext: boolean;
  error?: string;
}> {
  const pagination = normalizePagination({ page, limit });

  if (!isConfigured() || !supabaseAdmin) {
    return {
      logs: [],
      page: pagination.page,
      limit: pagination.limit,
      hasNext: false,
      error: getConfigError(),
    };
  }

  const { data, error } = await supabaseAdmin
    .from('cron_publish_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .range(pagination.from, pagination.to);

  if (error) {
    return {
      logs: [],
      page: pagination.page,
      limit: pagination.limit,
      hasNext: false,
      error: error.message,
    };
  }

  const logs = ((data ?? []) as CronPublishLogRow[]).map(mapCronLog);

  return {
    logs,
    page: pagination.page,
    limit: pagination.limit,
    hasNext: logs.length === pagination.limit,
  };
}

export async function runCronPublishOnce({
  source,
}: {
  source: CronPublishSource;
}): Promise<CronPublishSummary> {
  const runId = createRunId();

  if (!isConfigured() || !supabaseAdmin) {
    return {
      processed: 0,
      published: 0,
      failed: 0,
      skipped: 0,
      runId,
      error: getConfigError(),
    };
  }

  const { settings, error: settingsError } = await adminGetCronPublishSettings();

  if (settingsError) {
    await insertCronLog({
      runId,
      status: 'error',
      step: 'settings',
      message: 'Unable to load Cron Publish settings.',
      errorMessage: settingsError,
    });

    return { processed: 0, published: 0, failed: 1, skipped: 0, runId, error: settingsError };
  }

  const now = new Date().toISOString();
  const today = getTodayKey();
  const currentTodayCount = settings.todayDate === today ? settings.todayCount : 0;

  if (!settings.enabled && source === 'cron') {
    await insertCronLog({
      runId,
      status: 'skipped',
      step: 'disabled',
      message: 'Cron Publish is disabled.',
    });
    await upsertSettings([
      { key: SETTINGS_KEYS.lastRunAt, value: now, value_type: 'datetime' },
      { key: SETTINGS_KEYS.todayDate, value: today, value_type: 'date' },
      { key: SETTINGS_KEYS.todayCount, value: String(currentTodayCount), value_type: 'number' },
    ]);

    return {
      processed: 0,
      published: 0,
      failed: 0,
      skipped: 1,
      runId,
      message: 'Cron Publish is disabled.',
    };
  }

  const remainingToday = Math.max(0, settings.maxPerDay - currentTodayCount);

  if (remainingToday <= 0) {
    await insertCronLog({
      runId,
      status: 'skipped',
      step: 'daily_limit',
      message: 'Daily publish limit has already been reached.',
    });
    await upsertSettings([
      { key: SETTINGS_KEYS.lastRunAt, value: now, value_type: 'datetime' },
      { key: SETTINGS_KEYS.todayDate, value: today, value_type: 'date' },
      { key: SETTINGS_KEYS.todayCount, value: String(currentTodayCount), value_type: 'number' },
    ]);

    return {
      processed: 0,
      published: 0,
      failed: 0,
      skipped: 1,
      runId,
      message: 'Daily publish limit reached.',
    };
  }

  const limit = Math.min(settings.batchSize, remainingToday);
  const categorySlug = settings.categoryFilter === 'all' ? '' : settings.categoryFilter;
  const { games, error: gamesError } = await adminListInactiveGamesForCron({
    page: 1,
    limit,
    categorySlug,
  });

  if (gamesError) {
    await insertCronLog({
      runId,
      status: 'error',
      step: 'select_games',
      message: 'Unable to load inactive games.',
      errorMessage: gamesError,
    });

    return { processed: 0, published: 0, failed: 1, skipped: 0, runId, error: gamesError };
  }

  if (games.length === 0) {
    await insertCronLog({
      runId,
      status: 'skipped',
      step: 'select_games',
      message: 'No inactive games matched the Cron Publish settings.',
    });
    await upsertSettings([
      { key: SETTINGS_KEYS.lastRunAt, value: now, value_type: 'datetime' },
      { key: SETTINGS_KEYS.todayDate, value: today, value_type: 'date' },
      { key: SETTINGS_KEYS.todayCount, value: String(currentTodayCount), value_type: 'number' },
    ]);

    return {
      processed: 0,
      published: 0,
      failed: 0,
      skipped: 1,
      runId,
      message: 'No inactive games to publish.',
    };
  }

  let processed = 0;
  let published = 0;
  let failed = 0;
  let skipped = 0;
  let firstFailureMessage = '';

  for (const game of games) {
    processed += 1;
    let articleGenerated = false;
    let metaDescriptionGenerated = false;
    let article = game.description;
    let metaDescription = game.seoDescription;

    const skipGame = async (message: string) => {
      skipped += 1;
      await insertCronLog({
        runId,
        gameId: game.id,
        gameSlug: game.slug,
        status: 'skipped',
        step: 'publish',
        message,
        articleGenerated,
        metaDescriptionGenerated,
      });
    };

    try {
      await insertCronLog({
        runId,
        gameId: game.id,
        gameSlug: game.slug,
        status: 'running',
        step: 'start_game',
        message: `Preparing ${game.title}.`,
      });

      const earlyBlockReason = await getPublishBlockReason(game, {
        requireArticle: false,
        requireMetaDescription: false,
        article,
        metaDescription,
      });

      if (earlyBlockReason) {
        await skipGame(earlyBlockReason);
        continue;
      }

      await insertCronLog({
        runId,
        gameId: game.id,
        gameSlug: game.slug,
        status: 'running',
        step: 'rewriting_article_started',
        message: 'Rewriting Article with AI before publishing.',
      });

      article = await generateGameContent({
        game: { ...game, description: article, seoDescription: metaDescription },
        templateKey: 'game_article',
        action: 'cron_generate_article',
        runId,
        temperature: 0.7,
        maxTokens: settings.articleMaxTokens,
      });
      article = normalizeGeneratedArticle(article);

      if (!hasText(article)) {
        throw new Error('AI returned an empty article.');
      }

      const { error: articleSaveError } = await supabaseAdmin
        .from('games')
        .update({ description: article, updated_at: new Date().toISOString() })
        .eq('id', game.id)
        .eq('is_active', false);

      if (articleSaveError) {
        throw new Error(articleSaveError.message);
      }

      articleGenerated = true;
      await insertCronLog({
        runId,
        gameId: game.id,
        gameSlug: game.slug,
        status: 'success',
        step: 'rewriting_article_success',
        message: 'Article rewritten and saved.',
        articleGenerated,
      });

      await insertCronLog({
        runId,
        gameId: game.id,
        gameSlug: game.slug,
        status: 'running',
        step: 'rewriting_meta_description_started',
        message: 'Rewriting SEO Description with AI before publishing.',
        articleGenerated,
      });

      metaDescription = await generateGameContent({
        game: { ...game, description: article, seoDescription: metaDescription },
        templateKey: 'game_seo_description',
        action: 'cron_generate_meta_description',
        runId,
        temperature: 0.5,
        maxTokens: settings.metaDescriptionMaxTokens,
      });
      metaDescription = normalizeGeneratedMetaDescription(metaDescription);

      if (!hasText(metaDescription)) {
        throw new Error('AI returned an empty SEO meta description.');
      }

      const { error: metaSaveError } = await supabaseAdmin
        .from('games')
        .update({ seo_description: metaDescription, updated_at: new Date().toISOString() })
        .eq('id', game.id)
        .eq('is_active', false);

      if (metaSaveError) {
        throw new Error(metaSaveError.message);
      }

      metaDescriptionGenerated = true;
      await insertCronLog({
        runId,
        gameId: game.id,
        gameSlug: game.slug,
        status: 'success',
        step: 'rewriting_meta_description_success',
        message: 'SEO Description rewritten and saved.',
        articleGenerated,
        metaDescriptionGenerated,
      });

      if (currentTodayCount + published >= settings.maxPerDay) {
        await skipGame('Daily publish limit reached before this game could be published.');
        continue;
      }

      const publishBlockReason = await getPublishBlockReason(game, {
        requireArticle: true,
        requireMetaDescription: true,
        article,
        metaDescription,
      });

      if (publishBlockReason) {
        await skipGame(publishBlockReason);
        continue;
      }

      const { error } = await supabaseAdmin
        .from('games')
        .update({
          is_active: true,
          published_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', game.id)
        .eq('is_active', false);

      if (error) {
        throw new Error(error.message);
      }

      published += 1;
      await insertCronLog({
        runId,
        gameId: game.id,
        gameSlug: game.slug,
        status: 'success',
        step: 'game_published',
        message: 'Game published.',
        articleGenerated,
        metaDescriptionGenerated,
        published: true,
      });
    } catch (gameError) {
      failed += 1;
      const errorMessage = gameError instanceof Error ? gameError.message : 'Unable to publish game.';

      if (!firstFailureMessage) {
        firstFailureMessage = errorMessage;
      }

      await insertCronLog({
        runId,
        gameId: game.id,
        gameSlug: game.slug,
        status: 'error',
        step: 'game_failed',
        message: 'Game was not published.',
        articleGenerated,
        metaDescriptionGenerated,
        errorMessage,
      });
    }
  }

  await upsertSettings([
    { key: SETTINGS_KEYS.lastRunAt, value: new Date().toISOString(), value_type: 'datetime' },
    { key: SETTINGS_KEYS.todayDate, value: today, value_type: 'date' },
    {
      key: SETTINGS_KEYS.todayCount,
      value: String(currentTodayCount + published),
      value_type: 'number',
    },
  ]);

  return {
    processed,
    published,
    failed,
    skipped,
    runId,
    message: firstFailureMessage || undefined,
  };
}
