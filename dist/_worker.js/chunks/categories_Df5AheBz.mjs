globalThis.process ??= {}; globalThis.process.env ??= {};
import { h as hasSupabaseEnv, a as supabase } from './supabase_C3sp2Zx_.mjs';

const fallbackCategories = [
	{
		id: "cat-clicker",
		name: "Clicker",
		slug: "clicker",
		icon: "CLK"
	},
	{
		id: "cat-io",
		name: "Io",
		slug: "io",
		icon: "IO"
	},
	{
		id: "cat-adventure",
		name: "Adventure",
		slug: "adventure",
		icon: "ADV"
	},
	{
		id: "cat-2-player",
		name: "2 Player",
		slug: "2-player",
		icon: "2P"
	},
	{
		id: "cat-shooting",
		name: "Shooting",
		slug: "shooting",
		icon: "SH"
	},
	{
		id: "cat-sports",
		name: "Sports",
		slug: "sports",
		icon: "SP"
	},
	{
		id: "cat-car",
		name: "Car",
		slug: "car",
		icon: "CAR"
	},
	{
		id: "cat-puzzle",
		name: "Puzzle",
		slug: "puzzle",
		icon: "PZ"
	},
	{
		id: "cat-casual",
		name: "Casual",
		slug: "casual",
		icon: "FUN"
	},
	{
		id: "cat-kids",
		name: "Kids",
		slug: "kids",
		icon: "KID"
	}
];

const mapSupabaseCategory = (category) => ({
  id: category.id,
  name: category.name,
  slug: category.slug,
  description: category.description,
  icon: category.icon,
  image: category.image,
  seoTitle: category.seo_title,
  seoDescription: category.seo_description,
  sortOrder: category.sort_order ?? 0,
  isActive: category.is_active !== false
});
const mapFallbackCategory = (category) => ({
  id: String(category.id ?? category.slug),
  name: category.name,
  slug: category.slug,
  description: category.description ?? null,
  icon: category.icon ?? null,
  image: category.image ?? null,
  seoTitle: category.seoTitle ?? null,
  seoDescription: category.seoDescription ?? null,
  sortOrder: category.sortOrder ?? 0,
  isActive: category.isActive !== false
});
const fallbackCategoryList = fallbackCategories.map(mapFallbackCategory).filter((category) => category.isActive);
const getCategorySlugAliases = (slug) => {
  const normalizedSlug = slug.replace(/\/$/, "");
  const compactSlug = normalizedSlug.replace(/-games$/, "");
  return Array.from(/* @__PURE__ */ new Set([normalizedSlug, compactSlug, `${compactSlug}-games`]));
};
const queryCategories = () => {
  if (!supabase) {
    return null;
  }
  return supabase.from("categories").select("*").eq("is_active", true);
};
async function getCategories() {
  if (hasSupabaseEnv) {
    const { data, error } = await queryCategories()?.order("sort_order", { ascending: true }).order("name") ?? {};
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
async function getCategoryBySlug(slug) {
  const slugAliases = getCategorySlugAliases(slug);
  if (hasSupabaseEnv) {
    const { data, error } = await queryCategories()?.in("slug", slugAliases).limit(1).maybeSingle() ?? {};
    if (!error && data) {
      return mapSupabaseCategory(data);
    }
  }
  return fallbackCategoryList.find((category) => slugAliases.includes(category.slug)) ?? null;
}

export { getCategoryBySlug as a, getCategories as g };
