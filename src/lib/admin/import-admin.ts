import { supabaseAdmin } from '../supabase';

export type ImportDuplicateMode = 'skip' | 'update';

export interface ImportPreviewRow {
  rowNumber: number;
  title: string;
  slug: string;
  iframeUrl: string;
  thumbnail: string;
  categorySlug: string;
  existsInDatabase: boolean;
  isDuplicateInInput: boolean;
  errors: string[];
}

export interface ImportPreviewResult {
  rows: ImportPreviewRow[];
  separator: 'comma' | 'tab';
  error?: string;
}

export interface ImportResult {
  importedCount: number;
  skippedCount: number;
  updatedCount: number;
  totalRows: number;
  error?: string;
}

interface CategoryRow {
  id: string;
  slug: string;
}

interface ImportGamePayload {
  title: string;
  slug: string;
  category_id: string | null;
  category_slug: string;
  thumbnail: string | null;
  iframe_url: string;
  short_description: string;
  description: string;
  instructions: string;
  rating: number;
  plays: number;
  is_active: boolean;
  seo_title: string;
  seo_description: string;
  updated_at: string;
}

const REQUIRED_HEADERS = ['gameName', 'gameIframe', 'gameImage'] as const;
const OPTIONAL_CATEGORY_HEADER = 'category';
const DEFAULT_CATEGORY = 'casual-games';
const CHUNK_SIZE = 500;

const categoryRules: Array<{ slug: string; keywords: string[] }> = [
  {
    slug: 'io-games',
    keywords: ['io', 'lol', 'evowars', 'openfront', 'poxel', 'buildnow', 'krunker', 'narrow one'],
  },
  {
    slug: 'car-games',
    keywords: ['car', 'road', 'chase', 'taxi', 'rider', 'racers', 'drift', 'ramp', 'bike', 'travel'],
  },
  {
    slug: 'shooting-games',
    keywords: ['shooter', 'gun', 'duty', 'pubg', 'fortnite', 'shell', 'deadshot', 'operator', 'mine shooter', 'time shooter'],
  },
  {
    slug: 'fighting-games',
    keywords: ['stickman', 'ragdoll', 'punch', 'brawl', 'kombat', 'war', 'weapon'],
  },
  {
    slug: 'adventure-games',
    keywords: ['dungeon', 'quest', 'adventure', 'castaway', 'kong', 'hollow', 'island', 'bear'],
  },
  {
    slug: 'casual-games',
    keywords: ['geometry', 'run', 'ovo', 'level devil', 'only up', 'getting over it', 'color rush', 'tube fall'],
  },
  {
    slug: 'clicker-games',
    keywords: ['brainrot', 'clicker', 'monkey mart', 'tap road'],
  },
  {
    slug: 'action-games',
    keywords: ['tank', 'plane', 'legion', 'battle'],
  },
];

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

const getCategorySlugCandidates = (value: string) => {
  const slug = slugify(value);

  if (!slug) {
    return [];
  }

  const candidates = [slug];

  if (!slug.endsWith('-games')) {
    candidates.push(`${slug}-games`);
  }

  return candidates;
};

const resolveCategorySlug = (
  value: string,
  categoryIds: Map<string, string>,
) => getCategorySlugCandidates(value).find((slug) => categoryIds.has(slug)) ?? slugify(value);

const countSeparator = (line: string, separator: ',' | '\t') => parseDelimitedLine(line, separator).length - 1;

const detectSeparator = (text: string): ',' | '\t' => {
  const firstLine = text.split(/\r?\n/).find((line) => line.trim().length > 0) ?? '';
  return countSeparator(firstLine, '\t') > countSeparator(firstLine, ',') ? '\t' : ',';
};

const parseDelimitedLine = (line: string, separator: ',' | '\t') => {
  const cells: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === separator && !inQuotes) {
      cells.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  cells.push(current.trim());
  return cells;
};

const parseDelimitedText = (text: string) => {
  const normalizedText = text.replace(/^\uFEFF/, '').trim();

  if (!normalizedText) {
    return { rows: [], separator: detectSeparator(text), error: 'Paste CSV/TSV data or upload a file.' };
  }

  const separator = detectSeparator(normalizedText);
  const lines = normalizedText.split(/\r?\n/).filter((line) => line.trim().length > 0);
  const headers = parseDelimitedLine(lines[0] ?? '', separator).map((header) => header.replace(/^\uFEFF/, '').trim());
  const normalizedHeaders = headers.map((header) => header.toLowerCase());
  const headerIndexes = Object.fromEntries(
    REQUIRED_HEADERS.map((header) => [header, normalizedHeaders.indexOf(header.toLowerCase())]),
  ) as Record<(typeof REQUIRED_HEADERS)[number], number>;
  const categoryIndex = normalizedHeaders.indexOf(OPTIONAL_CATEGORY_HEADER);

  const missingHeaders = REQUIRED_HEADERS.filter((header) => headerIndexes[header] < 0);

  if (missingHeaders.length > 0) {
    return {
      rows: [],
      separator,
      error: `Missing required header${missingHeaders.length === 1 ? '' : 's'}: ${missingHeaders.join(', ')}.`,
    };
  }

  const rows = lines.slice(1).map((line, index) => {
    const cells = parseDelimitedLine(line, separator);
    return {
      rowNumber: index + 2,
      gameName: cells[headerIndexes.gameName] ?? '',
      gameIframe: cells[headerIndexes.gameIframe] ?? '',
      gameImage: cells[headerIndexes.gameImage] ?? '',
      category: categoryIndex >= 0 ? cells[categoryIndex] ?? '' : '',
    };
  });

  return { rows, separator };
};

const keywordMatches = (title: string, keyword: string) => {
  const normalizedTitle = title.toLowerCase();
  const normalizedKeyword = keyword.toLowerCase();

  if (normalizedKeyword === 'io') {
    return /(^|[^a-z0-9])io([^a-z0-9]|$)/.test(normalizedTitle) || normalizedTitle.endsWith('.io');
  }

  if (normalizedKeyword.length <= 3 && normalizedKeyword !== 'lol' && normalizedKeyword !== 'ovo') {
    return new RegExp(`(^|[^a-z0-9])${normalizedKeyword}([^a-z0-9]|$)`).test(normalizedTitle);
  }

  return normalizedTitle.includes(normalizedKeyword);
};

const inferCategorySlug = (title: string) =>
  categoryRules.find((rule) => rule.keywords.some((keyword) => keywordMatches(title, keyword)))?.slug ??
  DEFAULT_CATEGORY;

const getExistingSlugs = async (slugs: string[]) => {
  if (!supabaseAdmin || slugs.length === 0) {
    return new Set<string>();
  }

  const existingSlugs = new Set<string>();
  const uniqueSlugs = Array.from(new Set(slugs));

  for (let index = 0; index < uniqueSlugs.length; index += CHUNK_SIZE) {
    const chunk = uniqueSlugs.slice(index, index + CHUNK_SIZE);
    const { data, error } = await supabaseAdmin.from('games').select('slug').in('slug', chunk);

    if (error) {
      throw new Error(error.message);
    }

    for (const game of data ?? []) {
      existingSlugs.add(game.slug);
    }
  }

  return existingSlugs;
};

const getCategoryIds = async () => {
  if (!supabaseAdmin) {
    return new Map<string, string>();
  }

  const { data, error } = await supabaseAdmin.from('categories').select('id,slug');

  if (error) {
    throw new Error(error.message);
  }

  return new Map((data ?? []).map((category) => {
    const row = category as CategoryRow;
    return [row.slug, row.id];
  }));
};

export async function adminPreviewGamesImport(text: string): Promise<ImportPreviewResult> {
  const parsed = parseDelimitedText(text);

  if (parsed.error) {
    return {
      rows: [],
      separator: parsed.separator === '\t' ? 'tab' : 'comma',
      error: parsed.error,
    };
  }

  try {
    const categoryIds = await getCategoryIds();
    const baseRows = parsed.rows.map((row) => {
      const title = row.gameName.trim();
      const slug = slugify(title);
      const providedCategory = row.category.trim();
      const categorySlug = providedCategory
        ? resolveCategorySlug(providedCategory, categoryIds)
        : inferCategorySlug(title);

      return {
        rowNumber: row.rowNumber,
        title,
        slug,
        iframeUrl: row.gameIframe.trim(),
        thumbnail: row.gameImage.trim(),
        categorySlug,
        hasProvidedCategory: Boolean(providedCategory),
      };
    });
    const existingSlugs = await getExistingSlugs(baseRows.map((row) => row.slug).filter(Boolean));
    const seenSlugs = new Set<string>();

    return {
      rows: baseRows.map((row) => {
        const errors: string[] = [];

        if (!row.title) {
          errors.push('Missing gameName');
        }

        if (!row.slug) {
          errors.push('Could not generate slug');
        }

        if (!row.iframeUrl) {
          errors.push('Missing gameIframe');
        }

        if (row.hasProvidedCategory && !categoryIds.has(row.categorySlug)) {
          errors.push('Category does not exist');
        }

        const isDuplicateInInput = Boolean(row.slug && seenSlugs.has(row.slug));

        if (row.slug) {
          seenSlugs.add(row.slug);
        }

        return {
          rowNumber: row.rowNumber,
          title: row.title,
          slug: row.slug,
          iframeUrl: row.iframeUrl,
          thumbnail: row.thumbnail,
          categorySlug: row.categorySlug,
          existsInDatabase: existingSlugs.has(row.slug),
          isDuplicateInInput,
          errors,
        };
      }),
      separator: parsed.separator === '\t' ? 'tab' : 'comma',
    };
  } catch (error) {
    return {
      rows: [],
      separator: parsed.separator === '\t' ? 'tab' : 'comma',
      error: error instanceof Error ? error.message : 'Unable to preview import.',
    };
  }
}

const toPayload = (
  row: ImportPreviewRow,
  categoryIds: Map<string, string>,
  importAsActive: boolean,
): ImportGamePayload => {
  const description = `Play ${row.title} online for free. Enjoy this browser game directly on our website.`;

  return {
    title: row.title,
    slug: row.slug,
    category_id: categoryIds.get(row.categorySlug) ?? null,
    category_slug: row.categorySlug,
    thumbnail: row.thumbnail || null,
    iframe_url: row.iframeUrl,
    short_description: description,
    description,
    instructions: 'Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.',
    rating: 4.5,
    plays: 0,
    is_active: importAsActive,
    seo_title: `${row.title} - Play Online`,
    seo_description: description,
    updated_at: new Date().toISOString(),
  };
};

export async function adminImportGamesFromText(
  text: string,
  duplicateMode: ImportDuplicateMode,
  importAsActive = false,
): Promise<ImportResult> {
  if (!supabaseAdmin) {
    return {
      importedCount: 0,
      skippedCount: 0,
      updatedCount: 0,
      totalRows: 0,
      error: 'Supabase admin client is not configured.',
    };
  }

  const preview = await adminPreviewGamesImport(text);

  if (preview.error) {
    return {
      importedCount: 0,
      skippedCount: 0,
      updatedCount: 0,
      totalRows: 0,
      error: preview.error,
    };
  }

  try {
    const categoryIds = await getCategoryIds();
    const validRows = preview.rows.filter((row) => row.errors.length === 0 && !row.isDuplicateInInput);
    const rowsToWrite =
      duplicateMode === 'skip'
        ? validRows.filter((row) => !row.existsInDatabase)
        : validRows;
    const newRows = rowsToWrite.filter((row) => !row.existsInDatabase);
    const existingRows = rowsToWrite.filter((row) => row.existsInDatabase);
    const newPayloads = newRows.map((row) => toPayload(row, categoryIds, importAsActive));
    const existingPayloads = existingRows.map((row) => {
      const { is_active: _isActive, ...payload } = toPayload(row, categoryIds, importAsActive);
      return payload;
    });
    const existingRowsToWrite = rowsToWrite.filter((row) => row.existsInDatabase).length;
    const newRowsToWrite = rowsToWrite.length - existingRowsToWrite;

    for (let index = 0; index < newPayloads.length; index += CHUNK_SIZE) {
      const chunk = newPayloads.slice(index, index + CHUNK_SIZE);
      const { error } = await supabaseAdmin.from('games').insert(chunk);

      if (error) {
        return {
          importedCount: 0,
          skippedCount: preview.rows.length,
          updatedCount: 0,
          totalRows: preview.rows.length,
          error: error.message,
        };
      }
    }

    for (let index = 0; index < existingPayloads.length; index += CHUNK_SIZE) {
      const chunk = existingPayloads.slice(index, index + CHUNK_SIZE);
      const { error } = await supabaseAdmin.from('games').upsert(chunk, { onConflict: 'slug' });

      if (error) {
        return {
          importedCount: 0,
          skippedCount: preview.rows.length,
          updatedCount: 0,
          totalRows: preview.rows.length,
          error: error.message,
        };
      }
    }

    return {
      importedCount: newRowsToWrite,
      updatedCount: duplicateMode === 'update' ? existingRowsToWrite : 0,
      skippedCount: preview.rows.length - rowsToWrite.length,
      totalRows: preview.rows.length,
    };
  } catch (error) {
    return {
      importedCount: 0,
      skippedCount: preview.rows.length,
      updatedCount: 0,
      totalRows: preview.rows.length,
      error: error instanceof Error ? error.message : 'Unable to import games.',
    };
  }
}
