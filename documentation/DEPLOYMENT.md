# Deployment

The project is deployed to Cloudflare Pages.

## Cloudflare Pages

- Build command: `npm run build`
- Output directory: `dist`
- Runtime: Cloudflare Pages with the Astro Cloudflare adapter.

## Required Environment Variables

Configure these in Cloudflare Pages Variables and Secrets:

- `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CRON_SECRET`

Add brand-specific public variables if the deployment uses them.

## Custom Domain Setup

1. Add the custom domain in Cloudflare Pages.
2. Confirm DNS records are active.
3. Confirm canonical URLs use the production domain.
4. Check sitemap and robots after deployment.

## Public SEO Checks

- `https://your-domain.com/sitemap.xml`
- `https://your-domain.com/robots.txt`
- `https://your-domain.com/ads.txt`

`ads.txt` is located at `public/ads.txt`.

## Admin Checks

- Confirm `/admin/login` works.
- Confirm admin dashboard loads.
- Confirm service-role features work server-side.
- Confirm imported games are inactive by default.

## Cron Worker Setup

1. Deploy the Cloudflare cron worker.
2. Configure schedule: `0 * * * *`.
3. Add `CRON_SECRET` to both Cloudflare Pages and the worker.
4. Confirm the worker calls `/api/cron/publish`.
5. Confirm Cron Publish respects enabled setting, batch size, and max per day.

## After Env Changes

Redeploy Cloudflare Pages after changing environment variables or secrets.

