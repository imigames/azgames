import { getSecret } from 'astro:env/server';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const normalizeEnvValue = (value: unknown) =>
  typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined;

const getPublicImportMetaEnv = (
  key: 'PUBLIC_SUPABASE_URL' | 'PUBLIC_SUPABASE_ANON_KEY',
) => {
  if (key === 'PUBLIC_SUPABASE_URL') {
    return normalizeEnvValue(import.meta.env.PUBLIC_SUPABASE_URL);
  }

  return normalizeEnvValue(import.meta.env.PUBLIC_SUPABASE_ANON_KEY);
};

const getServerSecret = (key: string) => {
  if (!import.meta.env.SSR) {
    return undefined;
  }

  try {
    return normalizeEnvValue(getSecret(key));
  } catch {
    return undefined;
  }
};

export const getSupabaseUrl = () =>
  getServerSecret('PUBLIC_SUPABASE_URL') ?? getPublicImportMetaEnv('PUBLIC_SUPABASE_URL');

export const getSupabaseAnonKey = () =>
  getServerSecret('PUBLIC_SUPABASE_ANON_KEY')
  ?? getPublicImportMetaEnv('PUBLIC_SUPABASE_ANON_KEY');

export const getSupabaseServiceRoleKey = () => getServerSecret('SUPABASE_SERVICE_ROLE_KEY');

export const hasSupabasePublicEnv = () =>
  Boolean(getSupabaseUrl() && getSupabaseAnonKey());

export const hasSupabaseAdminEnv = () =>
  Boolean(getSupabaseUrl() && getSupabaseServiceRoleKey());

export const getSupabaseEnvStatus = () => ({
  publicSupabaseUrlMissing: !getSupabaseUrl(),
  publicSupabaseAnonKeyMissing: !getSupabaseAnonKey(),
  supabaseServiceRoleKeyMissing: !getSupabaseServiceRoleKey(),
});

export const getSupabaseAdminConfigError = () => {
  const status = getSupabaseEnvStatus();

  return [
    'Supabase admin client is not configured.',
    `PUBLIC_SUPABASE_URL missing: ${status.publicSupabaseUrlMissing ? 'yes' : 'no'}.`,
    `SUPABASE_SERVICE_ROLE_KEY missing: ${status.supabaseServiceRoleKeyMissing ? 'yes' : 'no'}.`,
  ].join(' ');
};

export const getSupabasePublicClient = () => {
  const supabaseUrl = getSupabaseUrl();
  const supabaseAnonKey = getSupabaseAnonKey();

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey);
};

export const getSupabaseAdminClient = () => {
  const supabaseUrl = getSupabaseUrl();
  const serviceRoleKey = getSupabaseServiceRoleKey();

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

export const hasSupabaseEnv = hasSupabasePublicEnv();

export const supabase: SupabaseClient | null = getSupabasePublicClient();

export const createSupabaseServerClient = () => {
  const supabaseUrl = getSupabaseUrl();
  const supabaseAnonKey = getSupabaseAnonKey();

  return supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    : null;
};

export const supabaseAdmin: SupabaseClient | null = getSupabaseAdminClient();
