globalThis.process ??= {}; globalThis.process.env ??= {};
import { d as defineMiddleware, s as sequence } from './chunks/index_E85OBiTm.mjs';
import { c as createSupabaseServerClient } from './chunks/supabase_C3sp2Zx_.mjs';
import './chunks/astro-designed-error-pages_DEGsq8_i.mjs';
import './chunks/astro/server_jqlxmikg.mjs';

const ACCESS_COOKIE = "admin-access-token";
const REFRESH_COOKIE = "admin-refresh-token";
const adminEmails = [];
const onRequest$2 = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  if (!pathname.startsWith("/admin") || pathname === "/admin/login") {
    return next();
  }
  const accessToken = context.cookies.get(ACCESS_COOKIE)?.value;
  const refreshToken = context.cookies.get(REFRESH_COOKIE)?.value;
  if (!accessToken || !refreshToken) {
    return context.redirect("/admin/login");
  }
  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return context.redirect("/admin/login");
  }
  const { data, error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken
  });
  if (error || !data.user) {
    context.cookies.delete(ACCESS_COOKIE, { path: "/" });
    context.cookies.delete(REFRESH_COOKIE, { path: "/" });
    return context.redirect("/admin/login");
  }
  if (adminEmails.length > 0 && !adminEmails.includes(data.user.email?.toLowerCase() ?? "")) {
    context.cookies.delete(ACCESS_COOKIE, { path: "/" });
    context.cookies.delete(REFRESH_COOKIE, { path: "/" });
    return context.redirect("/admin/login");
  }
  return next();
});

const onRequest$1 = (context, next) => {
  if (context.isPrerendered) {
    context.locals.runtime ??= {
      env: process.env
    };
  }
  return next();
};

const onRequest = sequence(
	onRequest$1,
	onRequest$2
	
);

export { onRequest };
