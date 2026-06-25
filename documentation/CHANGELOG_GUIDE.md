# Changelog Guide

Use the changelog to keep project history readable for developers and AI agents.

## Rules

- Every major change should be written in `documentation/CHANGELOG.md`.
- Separate core changes from design changes.
- Keep entries short but specific.
- Mention important migrations, deployment changes, or admin behavior changes.

## Suggested Commit Prefixes

- `design: update homepage cards`
- `core: fix cron publish`
- `admin: improve comments moderation`
- `seo: update schema`
- `docs: update documentation`

## Entry Format

```md
## YYYY-MM-DD

- type: short description of the change.
```

Examples:

- `design: updated public game card hover effects.`
- `core: reduced Cron Publish AI token usage.`
- `docs: added reusable domain repository guide.`

