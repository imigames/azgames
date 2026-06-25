globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, f as createComponent, r as renderTemplate, h as addAttribute, o as renderSlot, p as renderHead } from './astro/server_jqlxmikg.mjs';
/* empty css                             */
import { S as SITE_NAME } from './site_ByuoMtRy.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://freegamezone.io");
const $$AdminLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$AdminLayout;
  const {
    title = `Admin | ${SITE_NAME}`,
    description = `${SITE_NAME} admin area.`,
    pageTitle,
    pageDescription
  } = Astro2.props;
  const currentPath = Astro2.url.pathname.replace(/\/$/, "") || "/";
  const isLoginPage = currentPath === "/admin/login";
  const inferredTitle = title.replace(/\s*\|\s*Free Game Zone\s*$/i, "").replace(/^Admin\s*/i, "").trim();
  const headerTitle = pageTitle ?? (inferredTitle || "Admin");
  const headerDescription = pageDescription ?? description;
  const navItems = [
    { href: "/admin", label: "Dashboard", icon: "CH" },
    { href: "/admin/games", label: "Games", icon: "GM" },
    { href: "/admin/categories", label: "Categories", icon: "CT" },
    { href: "/admin/reports", label: "Reports", icon: "RP" },
    { href: "/admin/comments", label: "Comments", icon: "CM" },
    { href: "/admin/contact-us", label: "Contact Messages", icon: "MS" },
    { href: "/admin/import", label: "Import", icon: "UP" },
    { href: "/admin/cron-publish", label: "Cron Publish", icon: "\u23F1\uFE0F" },
    { href: "/admin/ai-models", label: "Ai Models", icon: "\u{1F916}" },
    { href: "/admin/prompt-templates", label: "Prompt Templates", icon: "PT" },
    { href: "/admin/site-customization", label: "Site Customization", icon: "SC" },
    { href: "/admin/settings", label: "Settings", icon: "\u2699\uFE0F" }
  ];
  const isActiveNav = (href) => {
    if (href === "/admin") {
      return currentPath === "/admin";
    }
    return currentPath === href || currentPath.startsWith(`${href}/`);
  };
  return renderTemplate(_a || (_a = __template(['<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>', '</title><meta name="description"', '><meta name="robots" content="noindex, nofollow"><link rel="icon" type="image/svg+xml" href="/favicon.svg">', "</head> <body> ", " <script>\n      (() => {\n        const sidebar = document.querySelector('[data-admin-sidebar]');\n        const overlay = document.querySelector('[data-admin-sidebar-overlay]');\n        const toggle = document.querySelector('[data-admin-sidebar-toggle]');\n        const navLinks = document.querySelectorAll('[data-admin-nav-link]');\n\n        if (!sidebar || !overlay || !toggle) {\n          return;\n        }\n\n        const setOpen = (isOpen) => {\n          sidebar.classList.toggle('is-open', isOpen);\n          overlay.classList.toggle('is-open', isOpen);\n          overlay.hidden = !isOpen;\n          document.body.classList.toggle('admin-sidebar-open', isOpen);\n          toggle.setAttribute('aria-expanded', String(isOpen));\n          toggle.setAttribute('aria-label', isOpen ? 'Close admin menu' : 'Open admin menu');\n        };\n\n        toggle.addEventListener('click', () => {\n          setOpen(!sidebar.classList.contains('is-open'));\n        });\n\n        overlay.addEventListener('click', () => setOpen(false));\n        navLinks.forEach((link) => link.addEventListener('click', () => setOpen(false)));\n        document.addEventListener('keydown', (event) => {\n          if (event.key === 'Escape') {\n            setOpen(false);\n          }\n        });\n      })();\n    <\/script> </body> </html>"])), title, addAttribute(description, "content"), renderHead(), isLoginPage ? renderTemplate`<div class="admin-shell admin-shell--auth"> <header class="admin-login-header"> <a class="admin-brand" href="/admin/login"${addAttribute(`${SITE_NAME} admin login`, "aria-label")}> <span class="admin-brand-name">${SITE_NAME}</span> <span class="admin-brand-kicker">Admin Panel</span> </a> </header> <main class="admin-main admin-main--auth"> ${renderSlot($$result, $$slots["default"])} </main> </div>` : renderTemplate`<div class="admin-shell"> <div class="admin-sidebar-overlay" data-admin-sidebar-overlay hidden></div> <aside class="admin-sidebar" data-admin-sidebar aria-label="Admin navigation"> <div class="admin-sidebar-brand"> <a class="admin-brand" href="/admin/"${addAttribute(`${SITE_NAME} admin home`, "aria-label")}> <span class="admin-brand-name">${SITE_NAME}</span> <span class="admin-brand-kicker">Admin Panel</span> </a> </div> <nav class="admin-sidebar-nav" aria-label="Admin menu"> ${navItems.map((item) => renderTemplate`<a${addAttribute(["admin-sidebar-link", { "is-active": isActiveNav(item.href) }], "class:list")}${addAttribute(item.href, "href")} data-admin-nav-link> <span class="admin-sidebar-icon" aria-hidden="true">${item.icon}</span> <span>${item.label}</span> </a>`)} </nav> <form class="admin-sidebar-logout" method="post" action="/admin/"> <input type="hidden" name="intent" value="logout"> <button class="admin-logout-btn" type="submit">Logout</button> </form> </aside> <div class="admin-content-shell"> <header class="admin-header"> <button class="admin-menu-toggle" type="button" data-admin-sidebar-toggle aria-label="Open admin menu" aria-expanded="false"> <span></span> <span></span> <span></span> </button> <div class="admin-header-copy"> <h1>${headerTitle}</h1> ${headerDescription && renderTemplate`<p>${headerDescription}</p>`} </div> <div class="admin-header-actions"> ${renderSlot($$result, $$slots["actions"])} </div> </header> <main class="admin-main"> ${renderSlot($$result, $$slots["default"])} </main> </div> </div>`);
}, "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/layouts/AdminLayout.astro", void 0);

export { $$AdminLayout as $ };
