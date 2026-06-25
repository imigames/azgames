import { defineMiddleware } from 'astro:middleware';
import { createSupabaseServerClient } from './lib/supabase';

const ACCESS_COOKIE = 'admin-access-token';
const REFRESH_COOKIE = 'admin-refresh-token';
const adminEmails = (import.meta.env.ADMIN_EMAILS as string | undefined)
  ?.split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean) ?? [];

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  if (!pathname.startsWith('/admin') || pathname === '/admin/login') {
    return next();
  }

  const accessToken = context.cookies.get(ACCESS_COOKIE)?.value;
  const refreshToken = context.cookies.get(REFRESH_COOKIE)?.value;

  if (!accessToken || !refreshToken) {
    return context.redirect('/admin/login');
  }

  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return context.redirect('/admin/login');
  }

  const { data, error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  if (error || !data.user) {
    context.cookies.delete(ACCESS_COOKIE, { path: '/' });
    context.cookies.delete(REFRESH_COOKIE, { path: '/' });
    return context.redirect('/admin/login');
  }

  if (adminEmails.length > 0 && !adminEmails.includes(data.user.email?.toLowerCase() ?? '')) {
    context.cookies.delete(ACCESS_COOKIE, { path: '/' });
    context.cookies.delete(REFRESH_COOKIE, { path: '/' });
    return context.redirect('/admin/login');
  }

  return next();
});
