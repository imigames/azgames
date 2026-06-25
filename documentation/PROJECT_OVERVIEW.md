# Project Overview

This project is an Astro browser games website. It powers a public game portal and a protected admin dashboard.

The platform uses:

- Astro for the website and server routes.
- Supabase for PostgreSQL database, authentication, and admin data.
- Cloudflare Pages for deployment.
- Local JSON fallback data for safe development when Supabase is missing.

## What The Platform Does

- Shows active browser games to public visitors.
- Provides homepage sections, category pages, game detail pages, search, favorites, and legal pages.
- Lets admins manage games, categories, reports, comments, contact messages, settings, imports, AI providers, and prompt templates.
- Lets admins bulk import games as inactive.
- Uses Cron Publish to gradually generate AI content and activate games.
- Uses AI to generate game articles, SEO meta descriptions, and category content.

## Cron Publish Summary

Imported games are inactive by default. Cron Publish selects inactive games, rewrites/generates an Article and SEO Description using AI, saves the content, and only then activates the game.

Public pages only show games where `is_active = true`.

## Reusing The Source Code

Each new domain should have:

- Its own repository with a full copy of this source code.
- Its own Supabase project.
- Its own Cloudflare Pages project.
- Its own brand settings, domain, logo, assets, and public design.

The source code can be reused, but for a new brand only the public design should be changed unless the user explicitly asks for core platform changes.

