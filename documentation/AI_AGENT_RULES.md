# Rules for AI Agents Working on This Project

These rules are mandatory.

## Rules

1. Always read documentation before editing.
2. If the task is design-only, do not touch backend/admin/Supabase files.
3. Never expose secrets.
4. Never modify database schema unless explicitly requested.
5. Never remove active/inactive filtering.
6. Never make imported games active by default.
7. Never bypass Cron Publish.
8. Never edit API routes for visual changes.
9. Never edit admin dashboard for public design tasks.
10. Always run `npm run build`.
11. Report exactly which files were changed.
12. If unsure whether a file is core or design, ask before changing.
13. Preserve SEO logic.
14. Preserve schema JSON-LD.
15. Preserve comments/contact/report functionality.
16. Preserve AI generation and Prompt Templates.
17. Preserve Cloudflare Pages compatibility.

## Safe Design Task Checklist

Before editing:

- The request is about public visual design, public UX, branding, colors, layout, or assets.
- The files are public-facing components, public pages, public layouts, styles, or assets.
- No files under `src/lib`, `src/pages/api`, `src/pages/admin`, or `supabase` are needed.

After editing:

- Public pages still use existing data.
- Active/inactive filtering is unchanged.
- SEO meta and JSON-LD are preserved.
- Search, favorites, comments, reports, and game actions still work.
- `npm run build` passes.
- Final response lists changed files.

## If Unsure

Ask before changing a core file. It is better to pause than to accidentally break business logic.

