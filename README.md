# Free Game Zone Theme

Astro starter for a compact dark browser games website inspired by arcade listing sites.

## Structure

```text
src/
  components/
  layouts/
  pages/
  data/
  styles/
```

Game and category content is loaded from local JSON files in `src/data`. Game cards point at local image paths under `public/images/games/`, and the CSS includes a fallback background when those files do not exist yet.

## Commands

```sh
npm install
npm run dev
npm run build
```

## Cloudflare Cron Publish

Cron Publish uses a separate Cloudflare Worker with a scheduled trigger. The Worker does not access Supabase or AI keys directly. It calls the protected site endpoint:

```text
POST https://freegamezone.io/api/cron/publish
Authorization: Bearer CRON_SECRET
```

The scheduled endpoint calls `runCronPublishOnce({ source: "cron" })`, so it respects the `cron_publish_enabled` setting, the batch size, and the daily publish limit.

Required Cloudflare Pages environment variables and secrets for the Astro site:

```text
PUBLIC_SUPABASE_URL
PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
CRON_SECRET
```

`CRON_SECRET` protects `/api/cron/publish`. Add it in Cloudflare Pages under Variables and Secrets, and never expose or print the value.

Required Cloudflare Worker secret:

```sh
npx wrangler secret put CRON_SECRET --config wrangler.cron-publish.toml
```

Use the same `CRON_SECRET` value for Cloudflare Pages and the Cron Publish Worker. The Worker sends it as `Authorization: Bearer CRON_SECRET` when it calls the site endpoint.

Deploy the scheduled Worker:

```sh
npx wrangler deploy --config wrangler.cron-publish.toml
```

The Worker config includes this cron trigger:

```text
0 * * * *
```

That runs once every hour. Keep the same `CRON_SECRET` value in both Cloudflare Pages and the Worker.
