globalThis.process ??= {}; globalThis.process.env ??= {};
import { s as supabaseAdmin } from './supabase_C3sp2Zx_.mjs';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 40;
const escapeSearchValue = (value) => value.replaceAll("%", "\\%").replaceAll("_", "\\_").replaceAll(",", "\\,");
const getPagination = ({ page = DEFAULT_PAGE, limit = DEFAULT_LIMIT }) => {
  const safePage = Math.max(1, Math.trunc(page));
  const safeLimit = Math.max(1, Math.trunc(limit));
  const from = (safePage - 1) * safeLimit;
  const to = from + safeLimit - 1;
  return { page: safePage, limit: safeLimit, from, to };
};
const parsePlays = (value) => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }
  if (!value) {
    return 0;
  }
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
};
const parseNumber = (value, fallback = 0) => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : fallback;
  }
  if (!value) {
    return fallback;
  }
  const parsed = Number.parseFloat(value);
  return Number.isNaN(parsed) ? fallback : parsed;
};
const mapAdminGame = (game) => ({
  id: game.id,
  title: game.title,
  slug: game.slug,
  categorySlug: game.category_slug,
  thumbnail: game.thumbnail,
  iframeUrl: game.iframe_url ?? "",
  shortDescription: game.short_description ?? null,
  description: game.description ?? null,
  instructions: game.instructions ?? null,
  rating: parseNumber(game.rating ?? null, 4.5),
  plays: parsePlays(game.plays),
  isActive: game.is_active !== false,
  isNew: Boolean(game.is_new),
  isTrending: Boolean(game.is_trending),
  isHot: Boolean(game.is_hot),
  isPopular: Boolean(game.is_popular),
  isFeatured: Boolean(game.is_featured),
  seoTitle: game.seo_title ?? null,
  seoDescription: game.seo_description ?? null,
  hasArticle: Boolean(game.description?.trim()),
  hasMetaDescription: Boolean(game.seo_description?.trim())
});
const slugify = (value) => value.trim().toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
const getPayload = (data, { includeRemovedFields = true } = {}) => ({
  title: data.title.trim(),
  slug: (data.slug.trim() || slugify(data.title)).trim(),
  category_slug: data.categorySlug.trim() || null,
  thumbnail: data.thumbnail.trim() || null,
  iframe_url: data.iframeUrl.trim(),
  description: data.description.trim() || null,
  rating: Number.isFinite(data.rating) ? data.rating : 4.5,
  plays: Number.isFinite(data.plays) ? Math.max(0, Math.trunc(data.plays)) : 0,
  is_new: data.isNew,
  is_trending: data.isTrending,
  is_hot: data.isHot,
  is_popular: data.isPopular,
  is_featured: data.isFeatured,
  is_active: data.isActive,
  seo_title: data.seoTitle.trim() || null,
  seo_description: data.seoDescription.trim() || null,
  updated_at: (/* @__PURE__ */ new Date()).toISOString(),
  ...includeRemovedFields ? {
    short_description: data.shortDescription.trim() || null,
    instructions: data.instructions.trim() || null
  } : {}
});
const validatePayload = (payload) => {
  if (!payload.title) {
    return "Title is required.";
  }
  if (!payload.slug) {
    return "Slug is required.";
  }
  if (!payload.iframe_url) {
    return "Iframe URL is required.";
  }
  return "";
};
const hasDuplicateSlug = async (slug, currentId) => {
  if (!supabaseAdmin) {
    return false;
  }
  let query = supabaseAdmin.from("games").select("id").eq("slug", slug).limit(1);
  if (currentId) {
    query = query.neq("id", currentId);
  }
  const { data, error } = await query;
  if (error) {
    throw new Error(error.message);
  }
  return Boolean(data?.length);
};
async function adminListGames({
  search = "",
  categorySlug = "",
  status = "",
  contentStatus = "",
  page = DEFAULT_PAGE,
  limit = DEFAULT_LIMIT
} = {}) {
  const pagination = getPagination({ page, limit });
  if (!supabaseAdmin) {
    return {
      games: [],
      page: pagination.page,
      limit: pagination.limit,
      total: 0,
      hasNext: false,
      error: "Supabase admin client is not configured."
    };
  }
  let query = supabaseAdmin.from("games").select(
    "id,title,slug,category_slug,thumbnail,iframe_url,description,seo_description,plays,is_active,is_new,is_trending,is_hot,is_popular",
    { count: "exact" }
  ).order("created_at", { ascending: false }).range(pagination.from, pagination.to);
  const normalizedSearch = search.trim();
  if (normalizedSearch) {
    const escapedSearch = escapeSearchValue(normalizedSearch);
    query = query.or(`title.ilike.%${escapedSearch}%,slug.ilike.%${escapedSearch}%`);
  }
  if (categorySlug) {
    query = query.eq("category_slug", categorySlug);
  }
  if (status === "active") {
    query = query.eq("is_active", true);
  }
  if (status === "inactive") {
    query = query.eq("is_active", false);
  }
  if (contentStatus === "missing_article") {
    query = query.or("description.is.null,description.eq.");
  }
  if (contentStatus === "missing_meta") {
    query = query.or("seo_description.is.null,seo_description.eq.");
  }
  if (contentStatus === "ready_cron") {
    query = query.eq("is_active", false).not("title", "is", null).neq("title", "").not("slug", "is", null).neq("slug", "").not("iframe_url", "is", null).neq("iframe_url", "").not("thumbnail", "is", null).neq("thumbnail", "").not("category_slug", "is", null).neq("category_slug", "");
  }
  const { data, error, count } = await query;
  if (error) {
    return {
      games: [],
      page: pagination.page,
      limit: pagination.limit,
      total: 0,
      hasNext: false,
      error: error.message
    };
  }
  const total = count ?? 0;
  return {
    games: (data ?? []).map((game) => mapAdminGame(game)),
    page: pagination.page,
    limit: pagination.limit,
    total,
    hasNext: pagination.from + pagination.limit < total
  };
}
async function adminDeactivateGame(id) {
  if (!supabaseAdmin) {
    return { success: false, error: "Supabase admin client is not configured." };
  }
  const { error } = await supabaseAdmin.from("games").update({ is_active: false, updated_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", id);
  return error ? { success: false, error: error.message } : { success: true };
}
async function adminActivateGame(id) {
  if (!supabaseAdmin) {
    return { success: false, error: "Supabase admin client is not configured." };
  }
  const { error } = await supabaseAdmin.from("games").update({ is_active: true, updated_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", id);
  return error ? { success: false, error: error.message } : { success: true };
}
async function adminGetGameById(id) {
  if (!supabaseAdmin) {
    return null;
  }
  const { data, error } = await supabaseAdmin.from("games").select(
    "id,title,slug,category_slug,thumbnail,iframe_url,short_description,description,instructions,rating,plays,is_active,is_new,is_trending,is_hot,is_popular,is_featured,seo_title,seo_description"
  ).eq("id", id).maybeSingle();
  if (error || !data) {
    return null;
  }
  return mapAdminGame(data);
}
async function adminCreateGame(data) {
  if (!supabaseAdmin) {
    return { success: false, error: "Supabase admin client is not configured." };
  }
  const payload = {
    ...getPayload(data),
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    published_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  const validationError = validatePayload(payload);
  if (validationError) {
    return { success: false, error: validationError };
  }
  try {
    if (await hasDuplicateSlug(payload.slug)) {
      return { success: false, error: "A game with this slug already exists." };
    }
  } catch (error2) {
    return { success: false, error: error2 instanceof Error ? error2.message : "Unable to validate slug." };
  }
  const { error } = await supabaseAdmin.from("games").insert(payload);
  return error ? { success: false, error: error.message } : { success: true };
}
async function adminUpdateGame(id, data) {
  if (!supabaseAdmin) {
    return { success: false, error: "Supabase admin client is not configured." };
  }
  const payload = getPayload(data, { includeRemovedFields: false });
  const validationError = validatePayload(payload);
  if (validationError) {
    return { success: false, error: validationError };
  }
  try {
    if (await hasDuplicateSlug(payload.slug, id)) {
      return { success: false, error: "A game with this slug already exists." };
    }
  } catch (error2) {
    return { success: false, error: error2 instanceof Error ? error2.message : "Unable to validate slug." };
  }
  const { error } = await supabaseAdmin.from("games").update(payload).eq("id", id);
  return error ? { success: false, error: error.message } : { success: true };
}
async function adminListGameCategories() {
  if (!supabaseAdmin) {
    return [];
  }
  const { data, error } = await supabaseAdmin.from("categories").select("name,slug").eq("is_active", true).order("sort_order", { ascending: true }).order("name", { ascending: true });
  if (error) {
    return [];
  }
  return (data ?? []).map((category) => category);
}

export { adminListGameCategories as a, adminCreateGame as b, adminGetGameById as c, adminUpdateGame as d, adminActivateGame as e, adminDeactivateGame as f, adminListGames as g };
