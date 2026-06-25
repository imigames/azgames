import { getSecret } from 'astro:env/server';
import type { APIRoute } from 'astro';
import { runCronPublishOnce } from '../../../lib/cron-publish';

export const prerender = false;

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json',
    },
  });

const normalizeSecret = (value: unknown) =>
  typeof value === 'string' && value.trim().length > 0 ? value.trim() : '';

const getCronSecret = () => {
  try {
    return normalizeSecret(getSecret('CRON_SECRET'));
  } catch {
    return '';
  }
};

const getBearerToken = (request: Request) => {
  const authorization = request.headers.get('authorization') ?? '';
  const [scheme, token] = authorization.split(/\s+/, 2);

  return scheme?.toLowerCase() === 'bearer' ? normalizeSecret(token) : '';
};

export const POST: APIRoute = async ({ request }) => {
  const cronSecret = getCronSecret();

  if (!cronSecret) {
    return json({ ok: false, message: 'Cron secret is not configured.' }, 500);
  }

  if (getBearerToken(request) !== cronSecret) {
    return json({ ok: false, message: 'Unauthorized.' }, 401);
  }

  try {
    const summary = await runCronPublishOnce({ source: 'cron' });

    if (summary.error) {
      return json(
        {
          ok: false,
          message: summary.error,
          processed: summary.processed,
          published: summary.published,
          failed: summary.failed,
          skipped: summary.skipped,
        },
        500,
      );
    }

    const message = summary.processed === 0 && summary.message === 'No inactive games to publish.'
      ? 'No inactive games available.'
      : (
          summary.message
          ?? `Processed ${summary.processed}, Published ${summary.published}, Failed ${summary.failed}, Skipped ${summary.skipped}.`
        );

    return json({
      ok: true,
      source: 'cron',
      processed: summary.processed,
      published: summary.published,
      failed: summary.failed,
      skipped: summary.skipped,
      message,
    });
  } catch {
    return json({ ok: false, message: 'Unable to run Cron Publish right now.' }, 500);
  }
};

export const ALL: APIRoute = () =>
  json({ ok: false, message: 'Method not allowed.' }, 405);
