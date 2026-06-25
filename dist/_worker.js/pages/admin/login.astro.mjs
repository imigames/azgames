globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../../chunks/astro/server_jqlxmikg.mjs';
import { $ as $$AdminLayout } from '../../chunks/AdminLayout_DpMMXuWw.mjs';
import { h as hasSupabaseEnv, c as createSupabaseServerClient } from '../../chunks/supabase_C3sp2Zx_.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://freegamezone.io");
const prerender = false;
const $$Login = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Login;
  const ACCESS_COOKIE = "admin-access-token";
  const REFRESH_COOKIE = "admin-refresh-token";
  let errorMessage = "";
  let email = "";
  if (Astro2.request.method === "POST") {
    const formData = await Astro2.request.formData();
    email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    if (!hasSupabaseEnv) {
      errorMessage = "Supabase environment variables are missing.";
    } else if (!email || !password) {
      errorMessage = "Email and password are required.";
    } else {
      const supabase = createSupabaseServerClient();
      const { data, error } = supabase ? await supabase.auth.signInWithPassword({ email, password }) : { data: null, error: { message: "Supabase client is not configured." } };
      if (error || !data?.session) {
        errorMessage = error?.message ?? "Unable to sign in.";
      } else {
        const secure = Astro2.url.protocol === "https:";
        Astro2.cookies.set(ACCESS_COOKIE, data.session.access_token, {
          httpOnly: true,
          sameSite: "lax",
          secure,
          path: "/",
          maxAge: data.session.expires_in
        });
        Astro2.cookies.set(REFRESH_COOKIE, data.session.refresh_token, {
          httpOnly: true,
          sameSite: "lax",
          secure,
          path: "/",
          maxAge: 60 * 60 * 24 * 30
        });
        return Astro2.redirect("/admin/");
      }
    }
  }
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Admin Login | Free Game Zone", "description": "Sign in to the Free Game Zone admin area." }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="admin-auth-panel" aria-labelledby="admin-login-title"> <h1 id="admin-login-title">Admin Login</h1> <form class="admin-form" method="post" action="/admin/login"> <label> <span>Email</span> <input type="email" name="email" autocomplete="email"${addAttribute(email, "value")} required> </label> <label> <span>Password</span> <input type="password" name="password" autocomplete="current-password" required> </label> ${errorMessage && renderTemplate`<p class="admin-error">${errorMessage}</p>`} <button type="submit">Login</button> </form> </section> ` })}`;
}, "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/pages/admin/login.astro", void 0);

const $$file = "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/pages/admin/login.astro";
const $$url = "/admin/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
