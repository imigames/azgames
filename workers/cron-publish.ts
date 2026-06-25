export interface Env {
  CRON_SECRET: string;
  SITE_URL?: string;
  PUBLIC_SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
}

const DEFAULT_SITE_URL = 'https://freegamezone.io';

const getSiteUrl = (env: Env) => (env.SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, '');

const runCronPublish = async (env: Env) => {
  if (!env.CRON_SECRET) {
    console.error('CRON_SECRET is not configured.');
    return;
  }

  const response = await fetch(`${getSiteUrl(env)}/api/cron/publish`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${env.CRON_SECRET}`,
      accept: 'application/json',
    },
  });
  const body = await response.text();

  if (!response.ok) {
    console.error(`Cron Publish failed with status ${response.status}: ${body.slice(0, 500)}`);
    return;
  }

  console.log(`Cron Publish completed: ${body.slice(0, 500)}`);
};

export default {
  async scheduled(_event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(runCronPublish(env));
  },
};
