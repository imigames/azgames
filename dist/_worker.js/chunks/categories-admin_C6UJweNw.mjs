globalThis.process ??= {}; globalThis.process.env ??= {};
import { s as supabaseAdmin } from './supabase_C3sp2Zx_.mjs';

const slugify = (value) => value.trim().toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
const mapAdminCategory = (category) => ({
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
const getPayload = (data) => ({
  name: data.name.trim(),
  slug: (data.slug.trim() || slugify(data.name)).trim(),
  description: data.description.trim() || null,
  icon: data.icon.trim() || null,
  image: data.image.trim() || null,
  seo_title: data.seoTitle.trim() || null,
  seo_description: data.seoDescription.trim() || null,
  sort_order: Number.isFinite(data.sortOrder) ? Math.trunc(data.sortOrder) : 0,
  is_active: data.isActive,
  updated_at: (/* @__PURE__ */ new Date()).toISOString()
});
const validatePayload = (payload) => {
  if (!payload.name) {
    return "Name is required.";
  }
  if (!payload.slug) {
    return "Slug is required.";
  }
  return "";
};
const hasDuplicateSlug = async (slug, currentId) => {
  if (!supabaseAdmin) {
    return false;
  }
  let query = supabaseAdmin.from("categories").select("id").eq("slug", slug).limit(1);
  if (currentId) {
    query = query.neq("id", currentId);
  }
  const { data, error } = await query;
  if (error) {
    throw new Error(error.message);
  }
  return Boolean(data?.length);
};
async function adminListCategories() {
  if (!supabaseAdmin) {
    return { categories: [], error: "Supabase admin client is not configured." };
  }
  const { data, error } = await supabaseAdmin.from("categories").select("id,name,slug,description,icon,image,seo_title,seo_description,sort_order,is_active").order("sort_order", { ascending: true }).order("name", { ascending: true });
  if (error) {
    return { categories: [], error: error.message };
  }
  return { categories: (data ?? []).map((category) => mapAdminCategory(category)) };
}
async function adminGetCategoryById(id) {
  if (!supabaseAdmin) {
    return null;
  }
  const { data, error } = await supabaseAdmin.from("categories").select("id,name,slug,description,icon,image,seo_title,seo_description,sort_order,is_active").eq("id", id).maybeSingle();
  if (error || !data) {
    return null;
  }
  return mapAdminCategory(data);
}
async function adminCreateCategory(data) {
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
    if (await hasDuplicateSlug(payload.slug)) {
      return { success: false, error: "A category with this slug already exists." };
    }
  } catch (error2) {
    return { success: false, error: error2 instanceof Error ? error2.message : "Unable to validate slug." };
  }
  const { error } = await supabaseAdmin.from("categories").insert(payload);
  return error ? { success: false, error: error.message } : { success: true };
}
async function adminUpdateCategory(id, data) {
  if (!supabaseAdmin) {
    return { success: false, error: "Supabase admin client is not configured." };
  }
  const existingCategory = await adminGetCategoryById(id);
  if (!existingCategory) {
    return { success: false, error: "Category not found." };
  }
  const payload = getPayload(data);
  const validationError = validatePayload(payload);
  if (validationError) {
    return { success: false, error: validationError };
  }
  try {
    if (await hasDuplicateSlug(payload.slug, id)) {
      return { success: false, error: "A category with this slug already exists." };
    }
  } catch (error2) {
    return { success: false, error: error2 instanceof Error ? error2.message : "Unable to validate slug." };
  }
  const { error } = await supabaseAdmin.from("categories").update(payload).eq("id", id);
  if (error) {
    return { success: false, error: error.message };
  }
  if (existingCategory.slug !== payload.slug) {
    const { error: gamesError } = await supabaseAdmin.from("games").update({ category_slug: payload.slug, updated_at: (/* @__PURE__ */ new Date()).toISOString() }).or(`category_id.eq.${id},category_slug.eq.${existingCategory.slug}`);
    if (gamesError) {
      return { success: false, error: gamesError.message };
    }
  }
  return { success: true };
}
async function adminDeactivateCategory(id) {
  if (!supabaseAdmin) {
    return { success: false, error: "Supabase admin client is not configured." };
  }
  const { error } = await supabaseAdmin.from("categories").update({ is_active: false, updated_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", id);
  return error ? { success: false, error: error.message } : { success: true };
}

export { adminCreateCategory as a, adminGetCategoryById as b, adminUpdateCategory as c, adminDeactivateCategory as d, adminListCategories as e };
