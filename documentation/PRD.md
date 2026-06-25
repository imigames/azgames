# Product Requirements Document

## Product Name

Browser Games Platform

Current brand example: Free Game Zone

## Product Goal

Provide a reusable browser games platform that can be deployed for many domains. The platform supports a public game website, SEO-ready game/category pages, admin management, AI-assisted content generation, bulk imports, moderation, and gradual publishing.

## Target Users

- Players who want free browser games playable instantly.
- Site owners who want to launch game portals for different domains.
- Admin users who manage games, categories, imports, comments, reports, AI content, and SEO settings.
- Developers or AI agents customizing the public visual design for a new brand.

## Main Public Pages

- Homepage: featured sections, category tiles, game sections, random games, SEO content.
- Game page: game player, actions, article, related games, comments, structured data.
- Category page: paginated active games for one category.
- Search page: scalable server-side search.
- Favorites page: client-side favorites from localStorage.
- Legal/footer pages: about, copyright procedure, contact, privacy, terms.

## Main Admin Features

- Dashboard: overview and management cards.
- Games management: list, search, filters, create, edit, activate/deactivate.
- Categories management: create, edit, deactivate.
- Import games: CSV/TSV import with inactive-by-default behavior.
- Cron Publish: gradually rewrites AI content and activates inactive games.
- AI Models: configure OpenAI, Gemini, Claude/Anthropic, OpenRouter, or similar providers.
- Prompt Templates: editable prompts for SEO generation.
- Comments moderation: approve, mark pending, spam, delete.
- Reports: review game reports.
- Contact messages: manage contact form submissions.
- Settings: global site metadata and footer settings.

## SEO Requirements

- Page-specific or fallback meta title and description.
- Canonical URLs for public pages.
- `sitemap.xml` with only public active content.
- `robots.txt` pointing to the sitemap.
- `ads.txt` served from `public/ads.txt`.
- JSON-LD schema:
  - Homepage: Organization, WebSite, WebPage, ItemList.
  - Category page: CollectionPage, BreadcrumbList, ItemList.
  - Game page: VideoGame, WebPage, BreadcrumbList.
- Inactive games must not appear publicly.
- No fake AggregateRating unless real user voting exists.
- No fake reviews.

## Monetization Readiness

- `ads.txt` support.
- SEO content on game and category pages.
- Gradual publishing to avoid sudden mass indexing.
- Admin settings for global metadata.

## Non-Goals For Front-End Redesign Agents

Front-end redesign agents must not modify:

- Backend logic
- Supabase database schema
- Admin dashboard logic
- API routes
- Data layer
- Auth logic
- Cron Publish logic
- AI provider logic
- Prompt Templates logic
- Import logic
- Comments/contact backend logic

Their work should be limited to public design and public UX.

