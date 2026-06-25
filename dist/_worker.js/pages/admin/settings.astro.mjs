globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, f as createComponent, r as renderTemplate, k as renderComponent, m as maybeRenderHead, h as addAttribute } from '../../chunks/astro/server_jqlxmikg.mjs';
import { $ as $$AdminLayout } from '../../chunks/AdminLayout_DpMMXuWw.mjs';
import { g as getPublicSettings, a as adminListSettings, b as adminUpdateSettings } from '../../chunks/settings_CPS68JRK.mjs';
export { renderers } from '../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://freegamezone.io");
const prerender = false;
const $$Settings = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Settings;
  const settingKeys = [
    "site_name",
    "site_url",
    "contact_email",
    "default_meta_title",
    "default_meta_description",
    "default_og_image",
    "footer_copyright",
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
  const publicSettings = await getPublicSettings();
  const settingsResult = await adminListSettings();
  const settingsByKey = new Map(settingsResult.settings.map((setting) => [setting.key, setting.value ?? ""]));
  let values = {
    site_name: settingsByKey.get("site_name") ?? publicSettings.siteName,
    site_url: settingsByKey.get("site_url") ?? publicSettings.siteUrl,
    contact_email: settingsByKey.get("contact_email") ?? publicSettings.contactEmail,
    default_meta_title: settingsByKey.get("default_meta_title") ?? publicSettings.defaultMetaTitle,
    default_meta_description: settingsByKey.get("default_meta_description") ?? publicSettings.defaultMetaDescription,
    default_og_image: settingsByKey.get("default_og_image") ?? publicSettings.defaultOgImage,
    footer_copyright: settingsByKey.get("footer_copyright") ?? publicSettings.footerCopyright,
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
    values = Object.fromEntries(
      settingKeys.map((key) => [key, String(formData.get(key) ?? "").trim()])
    );
    if (!values.site_name) {
      error = "Site name is required.";
    } else if (!values.site_url.startsWith("https://")) {
      error = "Site URL must start with https://.";
    } else {
      const result = await adminUpdateSettings(values);
      if (result.success) {
        success = "Settings saved successfully.";
        error = "";
      } else {
        error = result.error ?? "Unable to save settings.";
      }
    }
  }
  return renderTemplate(_a || (_a = __template(["", " <script>\n  (() => {\n    const counters = document.querySelectorAll('[data-character-counter]');\n\n    counters.forEach((counter) => {\n      const inputId = counter.getAttribute('data-for');\n      const input = inputId ? document.getElementById(inputId) : null;\n\n      if (!input || !('value' in input)) {\n        return;\n      }\n\n      const updateCount = () => {\n        counter.textContent = String(input.value.length);\n      };\n\n      input.addEventListener('input', updateCount);\n      updateCount();\n    });\n  })();\n<\/script>"])), renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Settings | Free Game Zone", "description": "Manage global website metadata and default SEO settings." }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="admin-list-page" aria-labelledby="admin-settings-title"> <h1 id="admin-settings-title" class="sr-only">Settings</h1> <form class="admin-game-form admin-settings-form" method="post" action="/admin/settings"> ${error && renderTemplate`<p class="admin-error">${error}</p>`} ${success && renderTemplate`<p class="admin-success">${success}</p>`} <section class="admin-settings-section" aria-labelledby="settings-general-title"> <div class="admin-settings-section-heading"> <h2 id="settings-general-title">General</h2> <p>Core public identity and contact details for the website.</p> </div> <div class="admin-form-grid"> <label> <span>Site name</span> <input type="text" name="site_name"${addAttribute(values.site_name, "value")} required> </label> <label> <span>Site URL</span> <input type="url" name="site_url"${addAttribute(values.site_url, "value")} placeholder="https://6686game.com" required> </label> <label class="admin-form-wide"> <span>Contact email</span> <input type="email" name="contact_email"${addAttribute(values.contact_email, "value")}> </label> </div> </section> <section class="admin-settings-section" aria-labelledby="settings-branding-title"> <div class="admin-settings-section-heading"> <h2 id="settings-branding-title">Branding</h2> <p>Public logo and browser icon settings.</p> </div> <div class="admin-form-grid"> <label class="admin-form-wide"> <span>Website logo URL</span> <input type="text" name="site_logo_url"${addAttribute(values.site_logo_url, "value")} placeholder="/images/logo.svg"> </label> <label> <span>Logo alt text</span> <input type="text" name="site_logo_alt"${addAttribute(values.site_logo_alt, "value")}> </label> <label> <span>Short/mobile logo text</span> <input type="text" name="site_short_logo_text"${addAttribute(values.site_short_logo_text, "value")}> </label> <label class="admin-form-wide"> <span>Favicon URL</span> <input type="text" name="site_favicon_url"${addAttribute(values.site_favicon_url, "value")} placeholder="/favicon.svg"> </label> </div> </section> <section class="admin-settings-section" aria-labelledby="settings-seo-title"> <div class="admin-settings-section-heading"> <h2 id="settings-seo-title">SEO Defaults</h2> <p>Fallback metadata used when a page does not provide its own SEO content.</p> </div> <div class="admin-form-grid"> <label class="admin-form-wide"> <span>Default meta title</span> <input id="default-meta-title" type="text" name="default_meta_title"${addAttribute(values.default_meta_title, "value")} maxlength="70" data-character-source> <small class="admin-character-count"> <span data-character-counter data-for="default-meta-title" data-max="70">0</span>/70 characters
</small> </label> <label class="admin-form-wide"> <span>Default meta description</span> <textarea id="default-meta-description" name="default_meta_description" rows="4" maxlength="170" data-character-source>${values.default_meta_description}</textarea> <small class="admin-character-count"> <span data-character-counter data-for="default-meta-description" data-max="170">0</span>/170 characters
</small> </label> <label class="admin-form-wide"> <span>Default OG image</span> <input type="text" name="default_og_image"${addAttribute(values.default_og_image, "value")} placeholder="/og-image.jpg"> </label> </div> </section> <section class="admin-settings-section" aria-labelledby="settings-homepage-content-title"> <div class="admin-settings-section-heading"> <h2 id="settings-homepage-content-title">Homepage Content</h2> <p>Optional HTML content for the homepage article block. Leave empty to use the built-in fallback.</p> </div> <div class="admin-form-grid"> <label class="admin-form-wide"> <span>Homepage article title</span> <input type="text" name="homepage_article_title"${addAttribute(values.homepage_article_title, "value")}> </label> <label class="admin-form-wide"> <span>Homepage article content</span> <textarea name="homepage_article_content" rows="10">${values.homepage_article_content}</textarea> <small>Safe HTML is supported: H2/H3 headings, paragraphs, lists, links, and emphasis.</small> </label> </div> </section> <section class="admin-settings-section" aria-labelledby="settings-legal-content-title"> <div class="admin-settings-section-heading"> <h2 id="settings-legal-content-title">Footer / Legal Pages</h2> <p>Optional HTML content for public legal pages. Leave fields empty to use the built-in fallback text.</p> </div> <div class="admin-form-grid"> <label class="admin-form-wide"> <span>About us page content</span> <textarea name="about_page_content" rows="8">${values.about_page_content}</textarea> </label> <label class="admin-form-wide"> <span>Privacy policy content</span> <textarea name="privacy_policy_content" rows="8">${values.privacy_policy_content}</textarea> </label> <label class="admin-form-wide"> <span>Terms of use content</span> <textarea name="terms_of_use_content" rows="8">${values.terms_of_use_content}</textarea> </label> <label class="admin-form-wide"> <span>Copyright infringement notice content</span> <textarea name="copyright_policy_content" rows="8">${values.copyright_policy_content}</textarea> </label> <label class="admin-form-wide"> <span>Contact page intro content</span> <textarea name="contact_page_content" rows="8">${values.contact_page_content}</textarea> </label> </div> </section> <section class="admin-settings-section" aria-labelledby="settings-footer-title"> <div class="admin-settings-section-heading"> <h2 id="settings-footer-title">Footer</h2> <p>Text displayed in the public site footer.</p> </div> <div class="admin-form-grid"> <label class="admin-form-wide"> <span>Footer copyright</span> <input type="text" name="footer_copyright"${addAttribute(values.footer_copyright, "value")}> </label> </div> </section> <div class="admin-form-actions"> <button type="submit">Save Settings</button> </div> </form> </section> ` }));
}, "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/pages/admin/settings.astro", void 0);

const $$file = "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/pages/admin/settings.astro";
const $$url = "/admin/settings";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Settings,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
