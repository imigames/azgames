# Admin Panel

The admin panel is core product infrastructure. Do not redesign or change admin logic unless the user specifically asks for admin changes.

## Dashboard

Purpose: Show management links and high-level stats.

Manages: Navigation to operational areas.

Design agents must not change dashboard logic, stats queries, or admin protection.

## Games

Purpose: Manage game records.

Manages: create, edit, activate/deactivate, filters, content readiness, plays, flags.

Design agents must not change game save logic, active filtering, or Supabase mapping.

## Categories

Purpose: Manage category records.

Manages: create, edit, deactivate, SEO fields, sort order.

Design agents must not change category data logic.

## Reports

Purpose: Review game reports submitted by public users.

Manages: report status and moderation workflow.

Design agents must not change report handling logic.

## Comments

Purpose: Moderate game comments.

Manages: pending, approved, spam, deleted comments.

Design agents must not bypass moderation or expose emails publicly.

## Contact Messages

Purpose: Manage Contact Us submissions.

Manages: message status, admin notes, archive/spam workflow.

Design agents must not change backend contact submission logic.

## Import

Purpose: Bulk import games from CSV/TSV.

Manages: slug generation, category mapping, duplicate handling, inactive-by-default imports.

Design agents must not make imports active by default.

## Cron Publish

Purpose: Gradually publish inactive games after AI content generation.

Manages: batch size, daily limits, token settings, logs, inactive queue.

Design agents must not modify cron logic.

## AI Models

Purpose: Configure server-side AI providers.

Manages: OpenAI, Gemini, Claude/Anthropic, OpenRouter, API key status, default models.

Design agents must never expose API keys.

## Prompt Templates

Purpose: Manage AI prompt templates.

Manages: template keys, system prompts, user prompts, variables, active status.

Design agents must not hardcode prompts in public components.

## Settings

Purpose: Manage site metadata and global public settings.

Manages: site name, URL, SEO defaults, OG image, footer copyright.

Design agents may use settings output but should not change settings storage logic.

## Logout

Purpose: End admin session.

Design agents must not change auth/logout behavior.

