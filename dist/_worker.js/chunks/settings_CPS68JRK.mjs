globalThis.process ??= {}; globalThis.process.env ??= {};
import { S as SITE_NAME, D as DEFAULT_DESCRIPTION, a as DEFAULT_TITLE, b as SITE_URL } from './site_ByuoMtRy.mjs';
import { h as hasSupabaseEnv, a as supabase, s as supabaseAdmin } from './supabase_C3sp2Zx_.mjs';

const fallbackSettings = {
  siteName: SITE_NAME,
  siteUrl: SITE_URL,
  defaultMetaTitle: DEFAULT_TITLE,
  defaultMetaDescription: DEFAULT_DESCRIPTION,
  defaultOgImage: "/images/og-placeholder.svg",
  contactEmail: "",
  footerCopyright: `Copyright 2026 ${SITE_NAME}. All rights reserved.`,
  siteLogoUrl: "",
  siteLogoAlt: "",
  siteShortLogoText: "",
  siteFaviconUrl: "/favicon.svg",
  homepageArticleTitle: "",
  homepageArticleContent: "",
  aboutPageContent: "",
  privacyPolicyContent: "",
  termsOfUseContent: "",
  copyrightPolicyContent: "",
  contactPageContent: ""
};
const settingKeyMap = {
  site_name: "siteName",
  site_url: "siteUrl",
  default_meta_title: "defaultMetaTitle",
  default_meta_description: "defaultMetaDescription",
  default_og_image: "defaultOgImage",
  contact_email: "contactEmail",
  footer_copyright: "footerCopyright",
  site_logo_url: "siteLogoUrl",
  site_logo_alt: "siteLogoAlt",
  site_short_logo_text: "siteShortLogoText",
  site_favicon_url: "siteFaviconUrl",
  homepage_article_title: "homepageArticleTitle",
  homepage_article_content: "homepageArticleContent",
  about_page_content: "aboutPageContent",
  privacy_policy_content: "privacyPolicyContent",
  terms_of_use_content: "termsOfUseContent",
  copyright_policy_content: "copyrightPolicyContent",
  contact_page_content: "contactPageContent"
};
const knownSettingMeta = {
  site_name: {
    valueType: "text",
    groupName: "general",
    label: "Site name",
    description: "Public website name used in branding and metadata.",
    isPublic: true
  },
  site_url: {
    valueType: "url",
    groupName: "general",
    label: "Site URL",
    description: "Production website URL.",
    isPublic: true
  },
  default_meta_title: {
    valueType: "text",
    groupName: "seo",
    label: "Default meta title",
    description: "Fallback SEO title for public pages.",
    isPublic: true
  },
  default_meta_description: {
    valueType: "textarea",
    groupName: "seo",
    label: "Default meta description",
    description: "Fallback SEO description for public pages.",
    isPublic: true
  },
  default_og_image: {
    valueType: "image",
    groupName: "seo",
    label: "Default Open Graph image",
    description: "Fallback social sharing image.",
    isPublic: true
  },
  contact_email: {
    valueType: "email",
    groupName: "general",
    label: "Contact email",
    description: "Public contact email address.",
    isPublic: true
  },
  footer_copyright: {
    valueType: "text",
    groupName: "general",
    label: "Footer copyright",
    description: "Copyright text shown in the site footer.",
    isPublic: true
  },
  site_logo_url: {
    valueType: "image",
    groupName: "branding",
    label: "Website logo URL",
    description: "Optional image URL for the public header logo.",
    isPublic: true
  },
  site_logo_alt: {
    valueType: "text",
    groupName: "branding",
    label: "Logo alt text",
    description: "Accessible text for the public header logo.",
    isPublic: true
  },
  site_short_logo_text: {
    valueType: "text",
    groupName: "branding",
    label: "Short logo text",
    description: "Compact logo text used on smaller screens when no logo image is set.",
    isPublic: true
  },
  site_favicon_url: {
    valueType: "image",
    groupName: "branding",
    label: "Favicon URL",
    description: "Public favicon path or URL.",
    isPublic: true
  },
  homepage_article_title: {
    valueType: "text",
    groupName: "content",
    label: "Homepage article title",
    description: "Heading for the homepage content block.",
    isPublic: true
  },
  homepage_article_content: {
    valueType: "html",
    groupName: "content",
    label: "Homepage article content",
    description: "Safe HTML content for the homepage article block.",
    isPublic: true
  },
  about_page_content: {
    valueType: "html",
    groupName: "legal",
    label: "About page content",
    description: "Safe HTML content for the About us page.",
    isPublic: true
  },
  privacy_policy_content: {
    valueType: "html",
    groupName: "legal",
    label: "Privacy policy content",
    description: "Safe HTML content for the Privacy policy page.",
    isPublic: true
  },
  terms_of_use_content: {
    valueType: "html",
    groupName: "legal",
    label: "Terms of use content",
    description: "Safe HTML content for the Terms of use page.",
    isPublic: true
  },
  copyright_policy_content: {
    valueType: "html",
    groupName: "legal",
    label: "Copyright policy content",
    description: "Safe HTML content for the copyright notice page.",
    isPublic: true
  },
  contact_page_content: {
    valueType: "html",
    groupName: "legal",
    label: "Contact page intro content",
    description: "Safe HTML intro content shown above the Contact us form.",
    isPublic: true
  }
};
const mapSetting = (setting) => ({
  id: setting.id,
  key: setting.key,
  value: setting.value,
  valueType: setting.value_type ?? "text",
  groupName: setting.group_name ?? "general",
  label: setting.label,
  description: setting.description,
  isPublic: setting.is_public !== false,
  createdAt: setting.created_at,
  updatedAt: setting.updated_at
});
const toPublicSettings = (rows) => {
  const settings = { ...fallbackSettings };
  for (const row of rows) {
    const camelKey = settingKeyMap[row.key];
    if (camelKey && row.value !== null) {
      settings[camelKey] = row.value;
    }
  }
  return settings;
};
const createLabelFromKey = (key) => key.replaceAll("_", " ").replace(/\b\w/g, (character) => character.toUpperCase());
async function getPublicSettings() {
  if (hasSupabaseEnv && supabase) {
    const { data, error } = await supabase.from("site_settings").select("*").eq("is_public", true);
    if (!error && data) {
      return toPublicSettings(data);
    }
  }
  return fallbackSettings;
}
async function adminListSettings() {
  if (!supabaseAdmin) {
    return { settings: [], error: "Supabase admin client is not configured." };
  }
  const { data, error } = await supabaseAdmin.from("site_settings").select("*").order("group_name", { ascending: true }).order("key", { ascending: true });
  if (error) {
    return { settings: [], error: error.message };
  }
  return { settings: (data ?? []).map(mapSetting) };
}
async function adminUpdateSettings(settings) {
  if (!supabaseAdmin) {
    return { success: false, error: "Supabase admin client is not configured." };
  }
  const rows = Object.entries(settings).map(([key, value]) => {
    const normalizedKey = key.trim();
    if (!normalizedKey) {
      return null;
    }
    const meta = knownSettingMeta[normalizedKey] ?? {
      valueType: "text",
      groupName: "general",
      label: createLabelFromKey(normalizedKey),
      description: null,
      isPublic: true
    };
    return {
      key: normalizedKey,
      value: value ?? "",
      value_type: meta.valueType,
      group_name: meta.groupName,
      label: meta.label,
      description: meta.description,
      is_public: meta.isPublic,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
  }).filter((row) => row !== null);
  if (rows.length === 0) {
    return { success: true };
  }
  const { error } = await supabaseAdmin.from("site_settings").upsert(rows, { onConflict: "key" });
  return error ? { success: false, error: error.message } : { success: true };
}

export { adminListSettings as a, adminUpdateSettings as b, getPublicSettings as g };
