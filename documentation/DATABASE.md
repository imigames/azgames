# Database

The platform uses Supabase PostgreSQL. This document explains the purpose of the main tables. Check `supabase/schema.sql` for the exact current schema before making database changes.

## Main Tables

- `games`: game records, slugs, category references, iframe URLs, thumbnails, SEO fields, active status, flags, plays, and article content.
- `categories`: game categories, slugs, icons, images, SEO fields, and active status.
- `tags`: reusable tag records.
- `game_tags`: relationship table between games and tags.
- `game_reports`: reports submitted by users about games.
- `game_events`: tracking events such as view, play, like, favorite, and report.
- `game_comments`: user comments for game pages, moderated by status.
- `contact_messages`: Contact Us form submissions for admin review.
- `site_settings`: public site metadata, footer text, and configurable global settings.
- `ai_providers`: AI provider configuration for server-side use.
- `ai_generation_logs`: logs for AI generation attempts and results.
- `ai_prompt_templates`: editable prompt templates used by AI generation features.
- `cron_publish_settings`: settings for gradual publishing.
- `cron_publish_logs`: logs for each Cron Publish run and game step.

## Core Rules

- Public pages must only show games with `is_active = true`.
- Imported games should be inactive by default.
- Cron Publish activates games only after AI content generation succeeds.
- Inactive games must not appear in homepage sections, category pages, search, sitemap, or public SEO outputs.
- Do not change schema unless the user explicitly asks.
- Do not run migrations unless explicitly requested.
- Do not rename columns casually.
- Do not remove columns.
- Do not expose service-role access to client-side code.

## Design Task Warning

Database changes are not part of public front-end redesign work. If a design task seems to require database changes, ask the user before editing.

