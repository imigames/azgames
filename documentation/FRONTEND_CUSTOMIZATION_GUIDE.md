# Frontend Customization Guide

This guide explains what can be changed when creating a new domain design.

## Allowed For New Domain Design

You may change:

- Public header design.
- Logo.
- Public footer design.
- Homepage sections visual layout.
- Game cards.
- Category tiles.
- Game page visual layout.
- Category page visual layout.
- CSS variables.
- Public colors.
- Fonts.
- Spacing.
- Animations.
- Images/assets.
- Responsive UI.

## Not Allowed For Design-Only Work

Do not change:

- Supabase schema.
- `src/lib` business logic.
- API routes.
- Admin dashboard logic.
- Auth logic.
- Cron Publish logic.
- AI provider logic.
- Prompt Template logic.
- Import logic.
- Comments/contact backend logic.
- Active/inactive filtering logic.
- Service-role or server-side environment logic.

## Recommended Files To Edit For Design

- `src/styles/public.css`
- public assets in `public`
- public-facing components in `src/components`
- public layouts in `src/layouts` when they affect public pages
- homepage/game/category page markup only when the change is visual

## Files To Avoid

- `supabase/`
- `src/lib/`
- `src/pages/api/`
- `src/pages/admin/`
- `src/layouts/AdminLayout.astro`
- any file containing service-role keys or server-side environment logic

## Design Workflow

1. Read [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md).
2. Read [ARCHITECTURE.md](./ARCHITECTURE.md).
3. Read [AI_AGENT_RULES.md](./AI_AGENT_RULES.md).
4. Confirm the task is public design only.
5. Edit public UI/CSS/assets only.
6. Run `npm run build`.
7. Report exactly which files changed.

