# New Domain Repository Guide

Use this process when launching the platform for a new domain.

## Steps

1. Create a new GitHub repository.
2. Copy or clone this full source code into the new repository.
3. Update brand environment variables.
4. Create a new Supabase project.
5. Run the database schema.
6. Create the admin user.
7. Deploy to Cloudflare Pages.
8. Add the custom domain.
9. Add environment variables and secrets.
10. Add `ads.txt`.
11. Configure AI Models.
12. Configure Prompt Templates.
13. Test game import.
14. Test Cron Publish.
15. Start redesigning only public front-end files.

## Important Warning

For a new domain, do not change backend/core systems until the base site is working.

The first customization pass should focus on:

- Public logo and brand text.
- Public color palette.
- Public homepage layout.
- Game card visuals.
- Header/footer visuals.
- Public assets.

Avoid changing:

- Supabase schema.
- API routes.
- Data layer.
- Admin dashboard.
- Cron Publish.
- AI provider logic.
- Prompt Templates.

