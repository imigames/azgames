globalThis.process ??= {}; globalThis.process.env ??= {};
import { b as SITE_URL } from './site_ByuoMtRy.mjs';

const ALLOWED_TAGS = /* @__PURE__ */ new Set([
  "h2",
  "h3",
  "p",
  "ul",
  "ol",
  "li",
  "strong",
  "em",
  "a",
  "br",
  "blockquote"
]);
const ALLOWED_SITE_CONTENT_TAGS = /* @__PURE__ */ new Set([
  "h1",
  ...ALLOWED_TAGS
]);
const ALLOWED_HOMEPAGE_CONTENT_TAGS = /* @__PURE__ */ new Set([
  "h2",
  "h3",
  "p",
  "ul",
  "ol",
  "li",
  "strong",
  "em",
  "a",
  "br"
]);
const BLOCKED_CONTENT_TAGS = ["script", "iframe", "object", "embed", "style"];
const BLOCKED_TAGS = ["form", "input", "button", "img"];
const escapeAttribute = (value) => value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const sanitizeHref = (href) => {
  const trimmedHref = href.trim();
  const lowerHref = trimmedHref.toLowerCase();
  if (!trimmedHref || lowerHref.startsWith("javascript:") || lowerHref.startsWith("data:") || lowerHref.startsWith("vbscript:") || lowerHref.startsWith("file:")) {
    return null;
  }
  if (lowerHref.startsWith("http://") || lowerHref.startsWith("https://") || lowerHref.startsWith("mailto:") || lowerHref.startsWith("tel:") || lowerHref.startsWith("/") || lowerHref.startsWith("#")) {
    return trimmedHref;
  }
  return null;
};
const isExternalHref = (href) => {
  try {
    const parsedHref = new URL(href, SITE_URL);
    const siteUrl = new URL(SITE_URL);
    return ["http:", "https:"].includes(parsedHref.protocol) && parsedHref.origin !== siteUrl.origin;
  } catch {
    return false;
  }
};
const getHref = (attributes) => {
  const match = attributes.match(/\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/i);
  return match?.[1] ?? match?.[2] ?? match?.[3] ?? "";
};
const sanitizeGameArticleHtml = (html) => {
  let sanitized = html;
  for (const tag of BLOCKED_CONTENT_TAGS) {
    sanitized = sanitized.replace(
      new RegExp(`<\\s*${tag}\\b[^>]*>[\\s\\S]*?<\\/\\s*${tag}\\s*>`, "gi"),
      ""
    );
  }
  sanitized = sanitized.replace(/<!--[\s\S]*?-->/g, "").replace(/<!doctype[^>]*>/gi, "");
  for (const tag of BLOCKED_TAGS) {
    sanitized = sanitized.replace(new RegExp(`<\\/?\\s*${tag}\\b[^>]*>`, "gi"), "");
  }
  return sanitized.replace(/<\s*(\/?)\s*([a-zA-Z][a-zA-Z0-9-]*)\b([^<>]*)>/g, (_match, slash, rawTag, attributes) => {
    const isClosingTag = slash === "/";
    const tag = rawTag.toLowerCase() === "h1" ? "h2" : rawTag.toLowerCase();
    if (!ALLOWED_TAGS.has(tag)) {
      return "";
    }
    if (tag === "br") {
      return "<br>";
    }
    if (isClosingTag) {
      return `</${tag}>`;
    }
    if (tag !== "a") {
      return `<${tag}>`;
    }
    const href = sanitizeHref(getHref(attributes));
    if (!href) {
      return "<a>";
    }
    const safeHref = escapeAttribute(href);
    const externalAttributes = isExternalHref(href) ? ' target="_blank" rel="nofollow noopener noreferrer"' : "";
    return `<a href="${safeHref}"${externalAttributes}>`;
  });
};
const sanitizeSiteContentHtml = (html) => {
  let sanitized = html;
  for (const tag of BLOCKED_CONTENT_TAGS) {
    sanitized = sanitized.replace(
      new RegExp(`<\\s*${tag}\\b[^>]*>[\\s\\S]*?<\\/\\s*${tag}\\s*>`, "gi"),
      ""
    );
  }
  sanitized = sanitized.replace(/<!--[\s\S]*?-->/g, "").replace(/<!doctype[^>]*>/gi, "");
  for (const tag of BLOCKED_TAGS) {
    sanitized = sanitized.replace(new RegExp(`<\\/?\\s*${tag}\\b[^>]*>`, "gi"), "");
  }
  return sanitized.replace(/<\s*(\/?)\s*([a-zA-Z][a-zA-Z0-9-]*)\b([^<>]*)>/g, (_match, slash, rawTag, attributes) => {
    const isClosingTag = slash === "/";
    const tag = rawTag.toLowerCase();
    if (!ALLOWED_SITE_CONTENT_TAGS.has(tag)) {
      return "";
    }
    if (tag === "br") {
      return "<br>";
    }
    if (isClosingTag) {
      return `</${tag}>`;
    }
    if (tag !== "a") {
      return `<${tag}>`;
    }
    const href = sanitizeHref(getHref(attributes));
    if (!href) {
      return "<a>";
    }
    const safeHref = escapeAttribute(href);
    const externalAttributes = isExternalHref(href) ? ' target="_blank" rel="nofollow noopener noreferrer"' : "";
    return `<a href="${safeHref}"${externalAttributes}>`;
  });
};
const sanitizeHomepageContentHtml = (html) => {
  let sanitized = html;
  for (const tag of BLOCKED_CONTENT_TAGS) {
    sanitized = sanitized.replace(
      new RegExp(`<\\s*${tag}\\b[^>]*>[\\s\\S]*?<\\/\\s*${tag}\\s*>`, "gi"),
      ""
    );
  }
  sanitized = sanitized.replace(/<!--[\s\S]*?-->/g, "").replace(/<!doctype[^>]*>/gi, "");
  for (const tag of BLOCKED_TAGS) {
    sanitized = sanitized.replace(new RegExp(`<\\/?\\s*${tag}\\b[^>]*>`, "gi"), "");
  }
  return sanitized.replace(/<\s*(\/?)\s*([a-zA-Z][a-zA-Z0-9-]*)\b([^<>]*)>/g, (_match, slash, rawTag, attributes) => {
    const isClosingTag = slash === "/";
    const tag = rawTag.toLowerCase();
    if (!ALLOWED_HOMEPAGE_CONTENT_TAGS.has(tag)) {
      return "";
    }
    if (tag === "br") {
      return "<br>";
    }
    if (isClosingTag) {
      return `</${tag}>`;
    }
    if (tag !== "a") {
      return `<${tag}>`;
    }
    const href = sanitizeHref(getHref(attributes));
    if (!href) {
      return "<a>";
    }
    const safeHref = escapeAttribute(href);
    const externalAttributes = isExternalHref(href) ? ' target="_blank" rel="nofollow noopener noreferrer"' : "";
    return `<a href="${safeHref}"${externalAttributes}>`;
  });
};
const htmlToPlainText = (html) => sanitizeGameArticleHtml(html).replace(/<[^>]*>/g, " ").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&quot;/gi, '"').replace(/&#39;/gi, "'").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/\s+/g, " ").trim();

export { sanitizeHomepageContentHtml as a, sanitizeGameArticleHtml as b, htmlToPlainText as h, sanitizeSiteContentHtml as s };
