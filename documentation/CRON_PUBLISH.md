# Cron Publish

Cron Publish is the controlled publishing system for imported games.

## How It Works

1. Bulk imported games are inactive by default.
2. Cron Publish selects inactive games.
3. For each selected game, it rewrites/generates:
   - Article using the `game_article` prompt template.
   - SEO Description using the `game_seo_description` prompt template.
4. It saves the generated content to the game record.
5. It activates the game only after required AI content exists.
6. It logs each step in `cron_publish_logs`.

## Limits

Cron Publish respects:

- Batch size per run.
- Max games per day.
- Category filter.
- Token settings for article/meta generation.

Manual runs can be started from admin. Scheduled runs can be triggered by Cloudflare.

## Cloudflare Worker

A Cloudflare Worker can call:

`POST /api/cron/publish`

The endpoint is protected by `CRON_SECRET`.

## Rules

- Do not publish games without Article and SEO Description.
- Do not include inactive games in sitemap, search, homepage, category pages, or public game lists.
- Do not overwrite active games through Cron Publish.
- Do not bypass Cron Publish for imported games unless the user explicitly asks.
- Do not modify cron logic for front-end design work.

