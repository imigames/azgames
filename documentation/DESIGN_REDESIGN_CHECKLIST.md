# Design Redesign Checklist

Use this checklist when creating a new domain repository and changing only the public design.

## Before Changes

- [ ] Confirm `npm run build` works before making changes.
- [ ] Confirm admin login works.
- [ ] Confirm games load from Supabase.
- [ ] Confirm the public site shows active games.

## Edit Boundaries

- [ ] Edit only public UI files.
- [ ] Do not touch `src/lib`.
- [ ] Do not touch `src/pages/api`.
- [ ] Do not touch `src/pages/admin`.
- [ ] Do not touch `supabase` schema files.
- [ ] Do not change authentication, admin, cron publish, AI, import, comments/contact, or data-layer logic.

## Public Page Testing

- [ ] Test homepage.
- [ ] Test game page.
- [ ] Test category page.
- [ ] Test search.
- [ ] Test mobile responsive layout.
- [ ] Test sitemap and robots:
  - `/sitemap.xml`
  - `/robots.txt`

## Final Verification

- [ ] Run `npm run build`.
- [ ] List changed files.
- [ ] Confirm no backend/admin/Supabase/API files were changed.

