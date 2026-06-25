globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../../chunks/astro/server_jqlxmikg.mjs';
import { $ as $$AdminLayout } from '../../chunks/AdminLayout_DpMMXuWw.mjs';
import { a as sanitizeHomepageContentHtml, s as sanitizeSiteContentHtml } from '../../chunks/html-sanitize_DC9IPhPx.mjs';
import { g as getPublicSettings, a as adminListSettings, b as adminUpdateSettings } from '../../chunks/settings_CPS68JRK.mjs';
import { s as supabaseAdmin, g as getSupabaseAdminConfigError } from '../../chunks/supabase_C3sp2Zx_.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://freegamezone.io");
const prerender = false;
const $$SiteCustomization = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$SiteCustomization;
  const settingKeys = [
    "site_logo_url",
    "site_logo_alt",
    "site_short_logo_text",
    "site_favicon_url",
    "homepage_article_title",
    "homepage_article_content",
    "about_page_content",
    "privacy_policy_content",
    "terms_of_use_content",
    "copyright_policy_content",
    "contact_page_content"
  ];
  const htmlSettingKeys = /* @__PURE__ */ new Set([
    "homepage_article_content",
    "about_page_content",
    "privacy_policy_content",
    "terms_of_use_content",
    "copyright_policy_content",
    "contact_page_content"
  ]);
  const siteAssetsBucket = "site-assets";
  const logoUploadConfig = {
    field: "logo_file",
    settingKey: "site_logo_url",
    label: "Logo",
    folder: "logos",
    maxSize: 2 * 1024 * 1024,
    extensions: /* @__PURE__ */ new Set(["png", "jpg", "jpeg", "webp", "svg"]),
    mimeTypes: /* @__PURE__ */ new Set(["image/png", "image/jpeg", "image/webp", "image/svg+xml"])
  };
  const faviconUploadConfig = {
    field: "favicon_file",
    settingKey: "site_favicon_url",
    label: "Favicon",
    folder: "favicons",
    maxSize: 512 * 1024,
    extensions: /* @__PURE__ */ new Set(["ico", "png", "svg"]),
    mimeTypes: /* @__PURE__ */ new Set(["image/x-icon", "image/vnd.microsoft.icon", "image/png", "image/svg+xml"])
  };
  const getFileExtension = (filename) => {
    const match = filename.toLowerCase().match(/\.([a-z0-9]+)$/);
    return match?.[1] ?? "";
  };
  const uploadSiteAsset = async (file, config) => {
    if (!supabaseAdmin) {
      return { url: "", error: getSupabaseAdminConfigError() };
    }
    const extension = getFileExtension(file.name);
    const mimeType = file.type.toLowerCase();
    if (!config.extensions.has(extension) || mimeType && !config.mimeTypes.has(mimeType)) {
      return { url: "", error: `${config.label} must be one of: ${Array.from(config.extensions).join(", ")}.` };
    }
    if (file.size > config.maxSize) {
      const maxLabel = config.maxSize >= 1024 * 1024 ? `${Math.round(config.maxSize / 1024 / 1024)}MB` : `${Math.round(config.maxSize / 1024)}KB`;
      return { url: "", error: `${config.label} must be smaller than ${maxLabel}.` };
    }
    const safeName = file.name.toLowerCase().replace(/\.[^.]+$/, "").replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48) || config.folder;
    const path = `${config.folder}/${Date.now()}-${safeName}.${extension}`;
    const { error: uploadError } = await supabaseAdmin.storage.from(siteAssetsBucket).upload(path, await file.arrayBuffer(), {
      cacheControl: "31536000",
      contentType: file.type || "application/octet-stream",
      upsert: true
    });
    if (uploadError) {
      const missingBucket = /bucket|not found/i.test(uploadError.message);
      return {
        url: "",
        error: missingBucket ? `Supabase Storage bucket "${siteAssetsBucket}" is missing. Create a public bucket named "${siteAssetsBucket}" and try again.` : uploadError.message
      };
    }
    const { data } = supabaseAdmin.storage.from(siteAssetsBucket).getPublicUrl(path);
    return { url: data.publicUrl, error: "" };
  };
  const publicSettings = await getPublicSettings();
  const settingsResult = await adminListSettings();
  const settingsByKey = new Map(settingsResult.settings.map((setting) => [setting.key, setting.value ?? ""]));
  let values = {
    site_logo_url: settingsByKey.get("site_logo_url") ?? publicSettings.siteLogoUrl,
    site_logo_alt: settingsByKey.get("site_logo_alt") ?? publicSettings.siteLogoAlt,
    site_short_logo_text: settingsByKey.get("site_short_logo_text") ?? publicSettings.siteShortLogoText,
    site_favicon_url: settingsByKey.get("site_favicon_url") ?? publicSettings.siteFaviconUrl,
    homepage_article_title: settingsByKey.get("homepage_article_title") ?? publicSettings.homepageArticleTitle,
    homepage_article_content: settingsByKey.get("homepage_article_content") ?? publicSettings.homepageArticleContent,
    about_page_content: settingsByKey.get("about_page_content") ?? publicSettings.aboutPageContent,
    privacy_policy_content: settingsByKey.get("privacy_policy_content") ?? publicSettings.privacyPolicyContent,
    terms_of_use_content: settingsByKey.get("terms_of_use_content") ?? publicSettings.termsOfUseContent,
    copyright_policy_content: settingsByKey.get("copyright_policy_content") ?? publicSettings.copyrightPolicyContent,
    contact_page_content: settingsByKey.get("contact_page_content") ?? publicSettings.contactPageContent
  };
  let error = settingsResult.error ?? "";
  let success = "";
  if (Astro2.request.method === "POST") {
    const formData = await Astro2.request.formData();
    const intent = String(formData.get("intent") ?? "save");
    if (intent === "reset") {
      values = Object.fromEntries(settingKeys.map((key) => [key, ""]));
    } else {
      values = Object.fromEntries(
        settingKeys.map((key) => {
          const rawValue = String(formData.get(key) ?? "").trim();
          if (key === "homepage_article_content") {
            return [key, sanitizeHomepageContentHtml(rawValue)];
          }
          return [key, htmlSettingKeys.has(key) ? sanitizeSiteContentHtml(rawValue) : rawValue];
        })
      );
      for (const config of [logoUploadConfig, faviconUploadConfig]) {
        const uploadFile = formData.get(config.field);
        if (uploadFile instanceof File && uploadFile.size > 0) {
          const uploadResult = await uploadSiteAsset(uploadFile, config);
          if (uploadResult.error) {
            error = uploadResult.error;
            break;
          }
          values[config.settingKey] = uploadResult.url;
        }
      }
    }
    const result = error ? { success: false, error } : await adminUpdateSettings(values);
    if (result.success) {
      success = intent === "reset" ? "Site customization reset to default fallback content." : "Site customization saved successfully.";
      error = "";
    } else {
      error = result.error ?? "Unable to save site customization.";
    }
  }
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Site Customization | Free Game Zone", "description": "Customize public branding, homepage content, and footer/legal page content." }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="admin-list-page" aria-labelledby="site-customization-title"> <h1 id="site-customization-title" class="sr-only">Site Customization</h1> <form class="admin-game-form admin-settings-form" method="post" action="/admin/site-customization" enctype="multipart/form-data"> ${error && renderTemplate`<p class="admin-error">${error}</p>`} ${success && renderTemplate`<p class="admin-success">${success}</p>`} <section class="admin-settings-section" aria-labelledby="custom-branding-title"> <div class="admin-settings-section-heading"> <h2 id="custom-branding-title">Branding</h2> <p>Control the public website logo and browser icon.</p> </div> <div class="admin-form-grid"> <label class="admin-form-wide"> <span>Logo URL</span> <input type="text" name="site_logo_url"${addAttribute(values.site_logo_url, "value")} placeholder="/images/logo.svg"> </label> <label class="admin-form-wide"> <span>Upload logo</span> <input type="file" name="logo_file" accept=".png,.jpg,.jpeg,.webp,.svg,image/png,image/jpeg,image/webp,image/svg+xml"> <small>PNG, JPG, JPEG, WEBP, or SVG. Max size: 2MB. Uploaded files are stored in the public Supabase Storage bucket <code>site-assets</code>.</small> </label> <label> <span>Logo alt text</span> <input type="text" name="site_logo_alt"${addAttribute(values.site_logo_alt, "value")}> </label> <label> <span>Short logo text</span> <input type="text" name="site_short_logo_text"${addAttribute(values.site_short_logo_text, "value")}> </label> <label class="admin-form-wide"> <span>Favicon URL</span> <input type="text" name="site_favicon_url"${addAttribute(values.site_favicon_url, "value")} placeholder="/favicon.svg"> </label> <label class="admin-form-wide"> <span>Upload favicon</span> <input type="file" name="favicon_file" accept=".ico,.png,.svg,image/x-icon,image/vnd.microsoft.icon,image/png,image/svg+xml"> <small>ICO, PNG, or SVG. Max size: 512KB. Create a public Supabase Storage bucket named <code>site-assets</code> if uploads report a missing bucket.</small> </label> </div> </section> <section class="admin-settings-section" aria-labelledby="custom-homepage-title"> <div class="admin-settings-section-heading"> <h2 id="custom-homepage-title">Homepage content</h2> <p>Use safe HTML for the homepage article/content block.</p> </div> <div class="admin-form-grid"> <label class="admin-form-wide"> <span>Homepage article title</span> <input type="text" name="homepage_article_title"${addAttribute(values.homepage_article_title, "value")}> </label> <label class="admin-form-wide"> <span>Homepage article content</span> <textarea name="homepage_article_content" rows="12">${values.homepage_article_content}</textarea> <small>Allowed tags: h2, h3, p, ul, ol, li, strong, em, a, br. Scripts, styles, iframes, forms, and inputs are removed.</small> </label> </div> </section> <section class="admin-settings-section" aria-labelledby="custom-legal-title"> <div class="admin-settings-section-heading"> <h2 id="custom-legal-title">Legal pages content</h2> <p>Use safe HTML for footer legal pages. Empty fields use the built-in fallback content.</p> </div> <div class="admin-form-grid"> <label class="admin-form-wide"> <span>About us content</span> <textarea name="about_page_content" rows="9">${values.about_page_content}</textarea> </label> <label class="admin-form-wide"> <span>Privacy policy content</span> <textarea name="privacy_policy_content" rows="9">${values.privacy_policy_content}</textarea> </label> <label class="admin-form-wide"> <span>Terms of use content</span> <textarea name="terms_of_use_content" rows="9">${values.terms_of_use_content}</textarea> </label> <label class="admin-form-wide"> <span>Copyright infringement notice procedure content</span> <textarea name="copyright_policy_content" rows="9">${values.copyright_policy_content}</textarea> </label> <label class="admin-form-wide"> <span>Contact us page content</span> <textarea name="contact_page_content" rows="9">${values.contact_page_content}</textarea> </label> </div> </section> <div class="admin-form-actions"> <button type="submit" name="intent" value="save">Save changes</button> <button class="admin-secondary-btn" type="submit" name="intent" value="reset">
Reset to default
</button> </div> </form> </section> ` })}`;
}, "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/pages/admin/site-customization.astro", void 0);

const $$file = "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/pages/admin/site-customization.astro";
const $$url = "/admin/site-customization";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$SiteCustomization,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
