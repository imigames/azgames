# Environment Variables

Do not commit secrets. Server-only variables must never be exposed to client-side JavaScript.

## Supabase

- `PUBLIC_SUPABASE_URL`: Supabase project URL. Public/client-visible.
- `PUBLIC_SUPABASE_ANON_KEY`: Supabase anon key. Public/client-visible.
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key. Server-only secret.

## Cron

- `CRON_SECRET`: server-only secret used to protect `/api/cron/publish`.

## Public Brand Settings

These may be used for domain-specific branding:

- `PUBLIC_SITE_NAME`
- `PUBLIC_SITE_URL`
- `PUBLIC_SITE_DOMAIN`
- `PUBLIC_LOGO_TEXT`
- `PUBLIC_SHORT_LOGO_TEXT`
- `PUBLIC_DEFAULT_META_TITLE`
- `PUBLIC_DEFAULT_META_DESCRIPTION`
- `PUBLIC_DEFAULT_OG_IMAGE`
- `PUBLIC_COPYRIGHT_TEXT`

Public variables can be client-visible, but they still should not contain private information.

## AI Providers

AI providers are normally configured through the admin AI Models section and stored server-side. If any provider keys/settings are env-based for a deployment, they must be treated as server-only secrets unless they intentionally start with `PUBLIC_`.

## Rules

- `PUBLIC_` variables can be visible in the browser.
- `SUPABASE_SERVICE_ROLE_KEY` must be server-only.
- `CRON_SECRET` must be server-only.
- Do not print secrets in logs.
- Do not commit `.env` with real values.
- Redeploy Cloudflare Pages after changing environment variables.

