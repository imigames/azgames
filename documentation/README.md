# Project Documentation

This folder explains how the Browser Games Platform works and how developers or AI agents should safely make changes.

The project is designed to be reused across multiple domain-specific repositories. For each new domain, copy the full source code into a separate repository, connect a separate Supabase project, then customize only the public front-end design unless the user explicitly asks for core changes.

## Read Order For AI Agents

Before changing files, read these documents in order:

1. [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)
2. [ARCHITECTURE.md](./ARCHITECTURE.md)
3. [AI_AGENT_RULES.md](./AI_AGENT_RULES.md)
4. [FRONTEND_CUSTOMIZATION_GUIDE.md](./FRONTEND_CUSTOMIZATION_GUIDE.md)
5. Only then make design changes.

## Documentation Index

- [PRD.md](./PRD.md) - Product requirements and major platform features.
- [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) - Simple explanation of the platform.
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical architecture and folder responsibilities.
- [DATABASE.md](./DATABASE.md) - Supabase table purposes and database rules.
- [ADMIN_PANEL.md](./ADMIN_PANEL.md) - Admin dashboard sections and boundaries.
- [CRON_PUBLISH.md](./CRON_PUBLISH.md) - Gradual AI-assisted publishing workflow.
- [AI_MODELS_AND_PROMPTS.md](./AI_MODELS_AND_PROMPTS.md) - AI providers, generation logs, and prompt templates.
- [SEO.md](./SEO.md) - SEO, sitemap, robots, ads.txt, and JSON-LD rules.
- [FRONTEND_CUSTOMIZATION_GUIDE.md](./FRONTEND_CUSTOMIZATION_GUIDE.md) - What can be redesigned for a new domain.
- [AI_AGENT_RULES.md](./AI_AGENT_RULES.md) - Strict rules for AI agents.
- [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md) - Required environment variables and secret handling.
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Cloudflare Pages deployment checklist.
- [NEW_DOMAIN_REPO_GUIDE.md](./NEW_DOMAIN_REPO_GUIDE.md) - How to reuse the source for another domain.
- [CHANGELOG_GUIDE.md](./CHANGELOG_GUIDE.md) - How to document changes.
- [CHANGELOG.md](./CHANGELOG.md) - Project documentation changelog.

## Critical Safety Boundary

For design-only work, AI agents are not allowed to modify core platform systems:

- Supabase database schema
- backend logic
- admin dashboard logic
- cron publish logic
- AI models logic
- prompt templates logic
- import logic
- comments/contact logic
- authentication logic
- API routes
- data layer
- core business logic

Design-only agents may modify public UI and styling only. See [FRONTEND_CUSTOMIZATION_GUIDE.md](./FRONTEND_CUSTOMIZATION_GUIDE.md).

