globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate, h as addAttribute, l as Fragment, m as maybeRenderHead } from '../../chunks/astro/server_jqlxmikg.mjs';
import { $ as $$AdminLayout } from '../../chunks/AdminLayout_DpMMXuWw.mjs';
import { s as supabaseAdmin } from '../../chunks/supabase_C3sp2Zx_.mjs';
export { renderers } from '../../renderers.mjs';

const REQUIRED_HEADERS = ["gameName", "gameIframe", "gameImage"];
const OPTIONAL_CATEGORY_HEADER = "category";
const DEFAULT_CATEGORY = "casual-games";
const CHUNK_SIZE = 500;
const categoryRules = [
  {
    slug: "io-games",
    keywords: ["io", "lol", "evowars", "openfront", "poxel", "buildnow", "krunker", "narrow one"]
  },
  {
    slug: "car-games",
    keywords: ["car", "road", "chase", "taxi", "rider", "racers", "drift", "ramp", "bike", "travel"]
  },
  {
    slug: "shooting-games",
    keywords: ["shooter", "gun", "duty", "pubg", "fortnite", "shell", "deadshot", "operator", "mine shooter", "time shooter"]
  },
  {
    slug: "fighting-games",
    keywords: ["stickman", "ragdoll", "punch", "brawl", "kombat", "war", "weapon"]
  },
  {
    slug: "adventure-games",
    keywords: ["dungeon", "quest", "adventure", "castaway", "kong", "hollow", "island", "bear"]
  },
  {
    slug: "casual-games",
    keywords: ["geometry", "run", "ovo", "level devil", "only up", "getting over it", "color rush", "tube fall"]
  },
  {
    slug: "clicker-games",
    keywords: ["brainrot", "clicker", "monkey mart", "tap road"]
  },
  {
    slug: "action-games",
    keywords: ["tank", "plane", "legion", "battle"]
  }
];
const slugify = (value) => value.trim().toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
const getCategorySlugCandidates = (value) => {
  const slug = slugify(value);
  if (!slug) {
    return [];
  }
  const candidates = [slug];
  if (!slug.endsWith("-games")) {
    candidates.push(`${slug}-games`);
  }
  return candidates;
};
const resolveCategorySlug = (value, categoryIds) => getCategorySlugCandidates(value).find((slug) => categoryIds.has(slug)) ?? slugify(value);
const countSeparator = (line, separator) => parseDelimitedLine(line, separator).length - 1;
const detectSeparator = (text) => {
  const firstLine = text.split(/\r?\n/).find((line) => line.trim().length > 0) ?? "";
  return countSeparator(firstLine, "	") > countSeparator(firstLine, ",") ? "	" : ",";
};
const parseDelimitedLine = (line, separator) => {
  const cells = [];
  let current = "";
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
      current = "";
      continue;
    }
    current += char;
  }
  cells.push(current.trim());
  return cells;
};
const parseDelimitedText = (text) => {
  const normalizedText = text.replace(/^\uFEFF/, "").trim();
  if (!normalizedText) {
    return { rows: [], separator: detectSeparator(text), error: "Paste CSV/TSV data or upload a file." };
  }
  const separator = detectSeparator(normalizedText);
  const lines = normalizedText.split(/\r?\n/).filter((line) => line.trim().length > 0);
  const headers = parseDelimitedLine(lines[0] ?? "", separator).map((header) => header.replace(/^\uFEFF/, "").trim());
  const normalizedHeaders = headers.map((header) => header.toLowerCase());
  const headerIndexes = Object.fromEntries(
    REQUIRED_HEADERS.map((header) => [header, normalizedHeaders.indexOf(header.toLowerCase())])
  );
  const categoryIndex = normalizedHeaders.indexOf(OPTIONAL_CATEGORY_HEADER);
  const missingHeaders = REQUIRED_HEADERS.filter((header) => headerIndexes[header] < 0);
  if (missingHeaders.length > 0) {
    return {
      rows: [],
      separator,
      error: `Missing required header${missingHeaders.length === 1 ? "" : "s"}: ${missingHeaders.join(", ")}.`
    };
  }
  const rows = lines.slice(1).map((line, index) => {
    const cells = parseDelimitedLine(line, separator);
    return {
      rowNumber: index + 2,
      gameName: cells[headerIndexes.gameName] ?? "",
      gameIframe: cells[headerIndexes.gameIframe] ?? "",
      gameImage: cells[headerIndexes.gameImage] ?? "",
      category: categoryIndex >= 0 ? cells[categoryIndex] ?? "" : ""
    };
  });
  return { rows, separator };
};
const keywordMatches = (title, keyword) => {
  const normalizedTitle = title.toLowerCase();
  const normalizedKeyword = keyword.toLowerCase();
  if (normalizedKeyword === "io") {
    return /(^|[^a-z0-9])io([^a-z0-9]|$)/.test(normalizedTitle) || normalizedTitle.endsWith(".io");
  }
  if (normalizedKeyword.length <= 3 && normalizedKeyword !== "lol" && normalizedKeyword !== "ovo") {
    return new RegExp(`(^|[^a-z0-9])${normalizedKeyword}([^a-z0-9]|$)`).test(normalizedTitle);
  }
  return normalizedTitle.includes(normalizedKeyword);
};
const inferCategorySlug = (title) => categoryRules.find((rule) => rule.keywords.some((keyword) => keywordMatches(title, keyword)))?.slug ?? DEFAULT_CATEGORY;
const getExistingSlugs = async (slugs) => {
  if (!supabaseAdmin || slugs.length === 0) {
    return /* @__PURE__ */ new Set();
  }
  const existingSlugs = /* @__PURE__ */ new Set();
  const uniqueSlugs = Array.from(new Set(slugs));
  for (let index = 0; index < uniqueSlugs.length; index += CHUNK_SIZE) {
    const chunk = uniqueSlugs.slice(index, index + CHUNK_SIZE);
    const { data, error } = await supabaseAdmin.from("games").select("slug").in("slug", chunk);
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
    return /* @__PURE__ */ new Map();
  }
  const { data, error } = await supabaseAdmin.from("categories").select("id,slug");
  if (error) {
    throw new Error(error.message);
  }
  return new Map((data ?? []).map((category) => {
    const row = category;
    return [row.slug, row.id];
  }));
};
async function adminPreviewGamesImport(text) {
  const parsed = parseDelimitedText(text);
  if (parsed.error) {
    return {
      rows: [],
      separator: parsed.separator === "	" ? "tab" : "comma",
      error: parsed.error
    };
  }
  try {
    const categoryIds = await getCategoryIds();
    const baseRows = parsed.rows.map((row) => {
      const title = row.gameName.trim();
      const slug = slugify(title);
      const providedCategory = row.category.trim();
      const categorySlug = providedCategory ? resolveCategorySlug(providedCategory, categoryIds) : inferCategorySlug(title);
      return {
        rowNumber: row.rowNumber,
        title,
        slug,
        iframeUrl: row.gameIframe.trim(),
        thumbnail: row.gameImage.trim(),
        categorySlug,
        hasProvidedCategory: Boolean(providedCategory)
      };
    });
    const existingSlugs = await getExistingSlugs(baseRows.map((row) => row.slug).filter(Boolean));
    const seenSlugs = /* @__PURE__ */ new Set();
    return {
      rows: baseRows.map((row) => {
        const errors = [];
        if (!row.title) {
          errors.push("Missing gameName");
        }
        if (!row.slug) {
          errors.push("Could not generate slug");
        }
        if (!row.iframeUrl) {
          errors.push("Missing gameIframe");
        }
        if (row.hasProvidedCategory && !categoryIds.has(row.categorySlug)) {
          errors.push("Category does not exist");
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
          errors
        };
      }),
      separator: parsed.separator === "	" ? "tab" : "comma"
    };
  } catch (error) {
    return {
      rows: [],
      separator: parsed.separator === "	" ? "tab" : "comma",
      error: error instanceof Error ? error.message : "Unable to preview import."
    };
  }
}
const toPayload = (row, categoryIds, importAsActive) => {
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
    instructions: "Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.",
    rating: 4.5,
    plays: 0,
    is_active: importAsActive,
    seo_title: `${row.title} - Play Online`,
    seo_description: description,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  };
};
async function adminImportGamesFromText(text, duplicateMode, importAsActive = false) {
  if (!supabaseAdmin) {
    return {
      importedCount: 0,
      skippedCount: 0,
      updatedCount: 0,
      totalRows: 0,
      error: "Supabase admin client is not configured."
    };
  }
  const preview = await adminPreviewGamesImport(text);
  if (preview.error) {
    return {
      importedCount: 0,
      skippedCount: 0,
      updatedCount: 0,
      totalRows: 0,
      error: preview.error
    };
  }
  try {
    const categoryIds = await getCategoryIds();
    const validRows = preview.rows.filter((row) => row.errors.length === 0 && !row.isDuplicateInInput);
    const rowsToWrite = duplicateMode === "skip" ? validRows.filter((row) => !row.existsInDatabase) : validRows;
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
      const { error } = await supabaseAdmin.from("games").insert(chunk);
      if (error) {
        return {
          importedCount: 0,
          skippedCount: preview.rows.length,
          updatedCount: 0,
          totalRows: preview.rows.length,
          error: error.message
        };
      }
    }
    for (let index = 0; index < existingPayloads.length; index += CHUNK_SIZE) {
      const chunk = existingPayloads.slice(index, index + CHUNK_SIZE);
      const { error } = await supabaseAdmin.from("games").upsert(chunk, { onConflict: "slug" });
      if (error) {
        return {
          importedCount: 0,
          skippedCount: preview.rows.length,
          updatedCount: 0,
          totalRows: preview.rows.length,
          error: error.message
        };
      }
    }
    return {
      importedCount: newRowsToWrite,
      updatedCount: duplicateMode === "update" ? existingRowsToWrite : 0,
      skippedCount: preview.rows.length - rowsToWrite.length,
      totalRows: preview.rows.length
    };
  } catch (error) {
    return {
      importedCount: 0,
      skippedCount: preview.rows.length,
      updatedCount: 0,
      totalRows: preview.rows.length,
      error: error instanceof Error ? error.message : "Unable to import games."
    };
  }
}

const $$Astro = createAstro("https://freegamezone.io");
const prerender = false;
const $$Import = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Import;
  const getUploadedText = async (formData) => {
    const uploadedFile = formData.get("importFile");
    if (uploadedFile && typeof uploadedFile === "object" && "size" in uploadedFile && "text" in uploadedFile && typeof uploadedFile.text === "function" && uploadedFile.size > 0) {
      return uploadedFile.text();
    }
    return "";
  };
  let csvText = "";
  let duplicateMode = "skip";
  let importAsActive = false;
  let preview = null;
  let importResult = null;
  let error = "";
  if (Astro2.request.method === "POST") {
    const formData = await Astro2.request.formData();
    const intent = String(formData.get("intent") ?? "preview");
    duplicateMode = String(formData.get("duplicateMode") ?? "skip") === "update" ? "update" : "skip";
    importAsActive = formData.has("importAsActive");
    const pastedText = String(formData.get("csvText") ?? "");
    const uploadedText = await getUploadedText(formData);
    csvText = uploadedText.trim() ? uploadedText : pastedText;
    if (intent === "import") {
      importResult = await adminImportGamesFromText(csvText, duplicateMode, importAsActive);
      if (importResult.error) {
        error = importResult.error;
      }
    } else {
      preview = await adminPreviewGamesImport(csvText);
      if (preview.error) {
        error = preview.error;
      }
    }
  }
  const duplicateExistingCount = preview?.rows.filter((row) => row.existsInDatabase).length ?? 0;
  const duplicateInputCount = preview?.rows.filter((row) => row.isDuplicateInInput).length ?? 0;
  const invalidCount = preview?.rows.filter((row) => row.errors.length > 0).length ?? 0;
  const validCount = preview?.rows.filter((row) => row.errors.length === 0 && !row.isDuplicateInInput).length ?? 0;
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Import Games | Free Game Zone", "description": "Bulk import games into Supabase." }, { "actions": async ($$result2) => renderTemplate`${maybeRenderHead()}<div class="admin-header-actions"> <a class="admin-link-btn" href="/admin/">Dashboard</a> <a class="admin-link-btn" href="/admin/games">Games</a> <form method="post" action="/admin/"> <input type="hidden" name="intent" value="logout"> <button class="admin-logout-btn" type="submit">Logout</button> </form> </div>`, "default": async ($$result2) => renderTemplate`  <section class="admin-list-page" aria-labelledby="admin-import-title"> <div class="admin-list-heading"> <div> <h1 id="admin-import-title">Import Games</h1> <p>Paste CSV/TSV rows with gameName, gameIframe, gameImage, and optional category headers.</p> </div> </div> <form class="admin-game-form" method="post" enctype="multipart/form-data" action="/admin/import"> ${error && renderTemplate`<p class="admin-error">${error}</p>`} ${importResult && !importResult.error && renderTemplate`<div class="admin-success"> <p>
Imported ${importResult.importedCount} game${importResult.importedCount === 1 ? "" : "s"},
              updated ${importResult.updatedCount}, skipped ${importResult.skippedCount}.
</p> <p> ${importAsActive ? "Imported games were created as active." : "Imported games are inactive by default. Review and activate them from the Games admin page."} </p> </div>`} <div class="admin-form-grid"> <label class="admin-form-wide"> <span>CSV/TSV data</span> <textarea name="csvText" rows="10"${addAttribute("gameName,gameIframe,gameImage,category\nExample Game,https://example.com/embed,https://example.com/image.jpg,Casual Games", "placeholder")}>${csvText}</textarea> <small class="admin-form-help">
If category is provided, it must already exist. Missing categories are skipped and are not created automatically.
</small> </label> <label class="admin-form-wide"> <span>Upload CSV/TSV file</span> <input type="file" name="importFile" accept=".csv,.tsv,text/csv,text/tab-separated-values"> </label> </div> <fieldset class="admin-import-options"> <legend>Publish status</legend> <label> <input type="checkbox" name="importAsActive"${addAttribute(importAsActive, "checked")}>
Import games as active
</label> <p class="admin-form-help">
Keep this unchecked for bulk imports. Imported games will stay hidden until you review and activate them.
</p> </fieldset> <fieldset class="admin-import-options"> <legend>Duplicate slugs</legend> <label> <input type="radio" name="duplicateMode" value="skip"${addAttribute(duplicateMode === "skip", "checked")}>
Skip duplicates
</label> <label> <input type="radio" name="duplicateMode" value="update"${addAttribute(duplicateMode === "update", "checked")}>
Update existing
</label> </fieldset> <div class="admin-form-actions"> <button type="submit" name="intent" value="preview">Preview Import</button> ${preview && preview.rows.length > 0 && renderTemplate`<button type="submit" name="intent" value="import">Import Games</button>`} <a class="admin-link-btn" href="/admin/games">Cancel</a> </div> </form> ${preview && preview.rows.length > 0 && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <div class="admin-import-stats" aria-label="Import preview stats"> <span>${preview.rows.length} rows</span> <span>${validCount} valid</span> <span>${duplicateExistingCount} existing slug${duplicateExistingCount === 1 ? "" : "s"}</span> <span>${duplicateInputCount} duplicate in input</span> <span>${invalidCount} invalid</span> <span>Separator: ${preview.separator}</span> </div> <div class="admin-table-wrap"> <table class="admin-table admin-import-table"> <thead> <tr> <th>Row</th> <th>Title</th> <th>Slug</th> <th>Category</th> <th>Iframe</th> <th>Thumbnail</th> <th>Status</th> </tr> </thead> <tbody> ${preview.rows.map((row) => {
    const hasProblems = row.errors.length > 0 || row.isDuplicateInInput || row.existsInDatabase;
    const statuses = [
      row.errors.length > 0 ? row.errors.join(", ") : "",
      row.isDuplicateInInput ? "Duplicate in input" : "",
      row.existsInDatabase ? "Already exists" : "",
      !row.existsInDatabase && row.errors.length === 0 && !row.isDuplicateInInput ? importAsActive ? "Will import as active" : "Will import as inactive" : ""
    ].filter(Boolean);
    return renderTemplate`<tr> <td>${row.rowNumber}</td> <td>${row.title || "-"}</td> <td><code>${row.slug || "-"}</code></td> <td>${row.categorySlug}</td> <td><span class="admin-import-url">${row.iframeUrl || "-"}</span></td> <td><span class="admin-import-url">${row.thumbnail || "-"}</span></td> <td> <span${addAttribute([
      "admin-import-status",
      {
        "admin-import-status--ok": !hasProblems,
        "admin-import-status--warn": hasProblems
      }
    ], "class:list")}> ${statuses.length > 0 ? statuses.join(" / ") : "Ready"} </span> </td> </tr>`;
  })} </tbody> </table> </div> ` })}`} </section> ` })}`;
}, "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/pages/admin/import.astro", void 0);

const $$file = "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/pages/admin/import.astro";
const $$url = "/admin/import";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Import,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
