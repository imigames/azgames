import type { APIRoute } from 'astro';
import { runCronPublishOnce } from '../../../lib/cron-publish';
import { createSupabaseServerClient } from '../../../lib/supabase';

export const prerender = false;

const ACCESS_COOKIE = 'admin-access-token';
const REFRESH_COOKIE = 'admin-refresh-token';
const adminEmails = (import.meta.env.ADMIN_EMAILS as string | undefined)
  ?.split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean) ?? [];

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json',
    },
  });

const getFriendlyMessage = (message = '') => {
  if (message.includes('No AI provider is configured')) {
    return 'No AI provider is configured.';
  }

  if (message.includes('Prompt template is missing or inactive')) {
    return 'Prompt template is missing or inactive.';
  }

  return message || 'Unable to run Cron Publish right now.';
};

const requireAdmin = async (context: Parameters<APIRoute>[0]) => {
  const accessToken = context.cookies.get(ACCESS_COOKIE)?.value;
  const refreshToken = context.cookies.get(REFRESH_COOKIE)?.value;

  if (!accessToken || !refreshToken) {
    return false;
  }

  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return false;
  }

  const { data, error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  if (error || !data.user) {
    return false;
  }

  return adminEmails.length === 0
    || adminEmails.includes(data.user.email?.toLowerCase() ?? '');
};

export const POST: APIRoute = async (context) => {
  if (!(await requireAdmin(context))) {
    return json({ ok: false, message: 'Admin session required.' }, 401);
  }

  try {
    const summary = await runCronPublishOnce({ source: 'manual' });

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

    return json({
      ok: true,
      processed: summary.processed,
      published: summary.published,
      failed: summary.failed,
      skipped: summary.skipped,
      message: summary.message
        ? getFriendlyMessage(summary.message)
        : `Processed ${summary.processed}, Published ${summary.published}, Failed ${summary.failed}, Skipped ${summary.skipped}.`,
    });
  } catch {
    console.error('Cron Publish manual run failed.');
    return json({ ok: false, message: 'Unable to run Cron Publish right now.' }, 500);
  }
};

export const ALL: APIRoute = () =>
  json({ ok: false, message: 'Method not allowed.' }, 405);
