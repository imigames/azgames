# AI Models And Prompts

The AI system supports server-side content generation for SEO and game/category content.

## AI Models

The AI Models admin section connects providers such as:

- OpenAI
- Google Gemini
- Anthropic Claude
- OpenRouter

AI API keys are stored for server-side use only. They must never be exposed in browser JavaScript, public HTML, logs, or screenshots.

## Prompt Templates

Prompt Templates control how AI generates content. They are stored in Supabase and editable from the admin panel.

Important template keys:

- `game_article`: generates the game Article.
- `game_seo_description`: generates the game SEO meta description.
- Category templates: generate category descriptions, SEO titles, and SEO descriptions.

## Generation Logs

AI generation attempts are recorded in `ai_generation_logs` with provider, model, action, target, prompt/result, status, and error information.

## Rules

- Do not hardcode prompts in public components.
- Use the Prompt Templates system.
- Keep AI calls server-side.
- Never expose AI API keys to the client.
- Admin must review generated content before saving in manual tools.
- Cron Publish may generate and save content automatically for inactive imported games according to its settings.

