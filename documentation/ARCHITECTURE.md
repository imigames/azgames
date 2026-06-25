# Architecture

## Frontend: Astro

Astro renders public pages, admin pages, and API routes. Public pages should remain fast, SEO-friendly, and paginated where needed.

## Hosting: Cloudflare Pages

The project is configured for Cloudflare Pages server rendering. Scheduled publishing can be triggered by a Cloudflare Worker calling a protected API endpoint.

## Database: Supabase PostgreSQL

Supabase stores games, categories, reports, comments, contact messages, settings, AI provider configuration, AI generation logs, prompt templates, and cron publish logs.

## Auth: Supabase Auth

Admin pages are protected by Supabase Auth. Public users should not access admin pages or service-role functionality.

## Admin Dashboard

Admin pages live under `src/pages/admin`. They manage operational data and must not be changed during public design-only work.

## API Routes

API routes live under `src/pages/api`. They handle search, reports, comments, contact messages, game events, admin AI generation, and cron publish triggers.

## Data Layer

Core data access lives in `src/lib`. Public pages and admin pages should use data-layer functions instead of querying Supabase directly unless there is an explicit core task.

## AI Provider Layer

AI providers are configured through admin. Server-side code calls providers using stored configuration. API keys must never be exposed client-side.

## Prompt Templates

Prompt templates are stored in Supabase and managed from admin. AI generation should use active templates instead of hardcoded prompts in components.

## Cron Publish

Cron Publish selects inactive games, generates fresh AI Article and SEO Description, saves them, activates the game, and logs each step. It respects batch size and daily limits.

## Public Pages

Public pages include homepage, game pages, category pages, search, favorites, and legal pages. Design customization should focus here.

## Static Public Assets

Static assets live in `public`. Logos, images, `ads.txt`, and other public files can be brand-specific.

## Environment Variables

Environment variables configure Supabase, site branding, Cloudflare cron secret, and other deployment settings. See [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md).

## Expected Folders

- `src/pages` - Astro routes.
- `src/pages/admin` - protected admin dashboard routes.
- `src/pages/api` - server API routes.
- `src/components` - reusable UI components.
- `src/layouts` - public and admin layouts.
- `src/lib` - data layer, business logic, AI, Supabase clients.
- `src/styles` - CSS.
- `src/config` - site config and constants.
- `public` - static assets.
- `supabase` - schema and seed SQL.
- `documentation` - project documentation.

## Core System Warning

`src/lib`, `src/pages/api`, `src/pages/admin`, and `supabase` are core system areas. Do not modify them for design-only tasks.

