import type { APIRoute } from 'astro';
import { SITE_URL } from '../config/site';

export const prerender = false;

export const GET: APIRoute = () =>
  new Response(`User-agent: *
Allow: /

Sitemap: ${new URL('/sitemap.xml', SITE_URL).toString()}
`, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
    },
  });
