import fallbackCategories from '../data/categories.json';
import { hasSupabaseEnv, supabase } from './supabase';
import type { Category } from '../types/game';

interface SupabaseCategoryRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  image: string | null;
  seo_title: string | null;
  seo_description: string | null;
  sort_order: number | null;
  is_active: boolean | null;
}

interface FallbackCategory {
  id?: string | number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image?: string;
  seoTitle?: string;
  seoDescription?: string;
  sortOrder?: number;
  isActive?: boolean;
}

const mapSupabaseCategory = (category: SupabaseCategoryRow): Category => ({
  id: category.id,
  name: category.name,
  slug: category.slug,
  description: category.description,
  icon: category.icon,
  image: category.image,
  seoTitle: category.seo_title,
  seoDescription: category.seo_description,
  sortOrder: category.sort_order ?? 0,
  isActive: category.is_active !== false,
});

const mapFallbackCategory = (category: FallbackCategory): Category => ({
  id: String(category.id ?? category.slug),
  name: category.name,
  slug: category.slug,
  description: category.description ?? null,
  icon: category.icon ?? null,
  image: category.image ?? null,
  seoTitle: category.seoTitle ?? null,
  seoDescription: category.seoDescription ?? null,
  sortOrder: category.sortOrder ?? 0,
  isActive: category.isActive !== false,
});

const fallbackCategoryList = (fallbackCategories as FallbackCategory[])
  .map(mapFallbackCategory)
  .filter((category) => category.isActive);

const getCategorySlugAliases = (slug: string) => {
  const normalizedSlug = slug.replace(/\/$/, '');
  const compactSlug = normalizedSlug.replace(/-games$/, '');
  return Array.from(new Set([normalizedSlug, compactSlug, `${compactSlug}-games`]));
};

const queryCategories = () => {
  if (!supabase) {
    return null;
  }

  return supabase.from('categories').select('*').eq('is_active', true);
};

export async function getCategories(): Promise<Category[]> {
  if (hasSupabaseEnv) {
    const { data, error } =
      (await queryCategories()?.order('sort_order', { ascending: true }).order('name')) ?? {};

    if (!error && data) {
      return data.map(mapSupabaseCategory);
    }
  }

  return [...fallbackCategoryList].sort((first, second) => {
    if (first.sortOrder !== second.sortOrder) {
      return first.sortOrder - second.sortOrder;
    }

    return first.name.localeCompare(second.name);
  });
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const slugAliases = getCategorySlugAliases(slug);

  if (hasSupabaseEnv) {
    const { data, error } =
      (await queryCategories()?.in('slug', slugAliases).limit(1).maybeSingle<SupabaseCategoryRow>()) ??
      {};

    if (!error && data) {
      return mapSupabaseCategory(data);
    }
  }

  return fallbackCategoryList.find((category) => slugAliases.includes(category.slug)) ?? null;
}
