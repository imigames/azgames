insert into categories (name, slug, icon, sort_order)
values
  ('Clicker Games', 'clicker-games', 'CLK', 10),
  ('Io Games', 'io-games', 'IO', 20),
  ('Adventure Games', 'adventure-games', 'ADV', 30),
  ('2 Player Games', '2-player-games', '2P', 40),
  ('Shooting Games', 'shooting-games', 'SH', 50),
  ('Sports Games', 'sports-games', 'SP', 60),
  ('Car Games', 'car-games', 'CAR', 70),
  ('Puzzle Games', 'puzzle-games', 'PZ', 80),
  ('Casual Games', 'casual-games', 'FUN', 90),
  ('Kids Games', 'kids-games', 'KID', 100),
  ('Action Games', 'action-games', 'ACT', 110),
  ('Fighting Games', 'fighting-games', 'FGT', 120)
on conflict (slug) do update
set
  name = excluded.name,
  icon = excluded.icon,
  sort_order = excluded.sort_order,
  is_active = true,
  updated_at = now();

insert into site_settings (key, value, value_type, group_name, label, description, is_public)
values
  (
    'site_name',
    'Free Game Zone',
    'text',
    'general',
    'Site name',
    'Public website name used in branding and metadata.',
    true
  ),
  (
    'site_url',
    'https://freegamezone.io',
    'url',
    'general',
    'Site URL',
    'Production website URL.',
    true
  ),
  (
    'default_meta_title',
    'Free Game Zone - Play Free Online Games',
    'text',
    'seo',
    'Default meta title',
    'Fallback SEO title for public pages.',
    true
  ),
  (
    'default_meta_description',
    'Play free online browser games instantly on Free Game Zone. Discover action, car, shooting, puzzle, io, casual, and adventure games.',
    'textarea',
    'seo',
    'Default meta description',
    'Fallback SEO description for public pages.',
    true
  ),
  (
    'default_og_image',
    '/og-image.jpg',
    'image',
    'seo',
    'Default Open Graph image',
    'Fallback social sharing image.',
    true
  ),
  (
    'contact_email',
    '',
    'email',
    'general',
    'Contact email',
    'Public contact email address.',
    true
  ),
  (
    'footer_copyright',
    'Copyright 2026 Free Game Zone. All rights reserved.',
    'text',
    'general',
    'Footer copyright',
    'Copyright text shown in the site footer.',
    true
  ),
  (
    'site_logo_url',
    '',
    'url',
    'branding',
    'Logo URL',
    'Public logo image URL. Empty uses the current text logo fallback.',
    true
  ),
  (
    'site_logo_alt',
    'Free Game Zone',
    'text',
    'branding',
    'Logo alt text',
    'Accessible alt text for the public logo.',
    true
  ),
  (
    'site_short_logo_text',
    'FGZ',
    'text',
    'branding',
    'Short logo text',
    'Compact logo text used on small screens when no logo image is configured.',
    true
  ),
  (
    'site_favicon_url',
    '/favicon.svg',
    'url',
    'branding',
    'Favicon URL',
    'Browser favicon URL.',
    true
  ),
  (
    'homepage_article_title',
    'Free Game Zone',
    'text',
    'content',
    'Homepage article title',
    'Title for the homepage article/content block.',
    true
  ),
  (
    'homepage_article_content',
    $site$
<p>Free Game Zone is a place for quick browser play, from fast arcade runs to thoughtful puzzle rounds and two-player challenges. Pick a title, open it in your browser, and start playing without waiting through a complicated setup.</p>
<p>The library is organized around simple paths like <a href="#new">new games</a>, <a href="#trending">trending games</a>, and category collections, so it is easy to jump from a familiar favorite to something unexpected.</p>
<h2>What makes Free Game Zone so appealing?</h2>
<p>The best arcade sites feel fast, visual, and easy to scan. This homepage keeps the focus on game art, compact rows, clear labels, and useful category shortcuts. Whether you want <a href="/category/puzzle-games/">Puzzle Games</a>, <a href="/category/car-games/">Car Games</a>, or <a href="/category/io-games/">Io Games</a>, the page is built to help you find a playable option in a few seconds.</p>
<h2>Give us feedback</h2>
<p>Tell us which games deserve more attention, which categories should expand next, and what would make browsing smoother. Player feedback helps shape future updates, from better sorting to richer game pages and more useful recommendations.</p>
$site$,
    'html',
    'content',
    'Homepage article content',
    'HTML content for the homepage article/content block.',
    true
  ),
  (
    'about_page_content',
    $site$
<h2>About Free Game Zone</h2>
<p>Free Game Zone is a browser games website available at freegamezone.io. It is made for quick play, simple browsing, and easy discovery, with organized pages for arcade, action, puzzle, car, sports, clicker, casual, and io games.</p>
<p>Many games on the site may be created by third-party developers or supplied through external providers. We do not claim ownership of third-party games, artwork, characters, trademarks, embedded content, or related materials.</p>
<h2>What we offer</h2>
<p>We offer categorized game listings, searchable game pages, favorites, likes, and simple information that helps players understand what a game is before they start. Our pages are designed to work across common desktop and mobile browsers with a compact arcade-style layout.</p>
<h2>Why players use our website</h2>
<p>Players use Free Game Zone because the layout is compact, visual, and easy to scan. The website is built around direct access, clear categories, and a familiar arcade-style experience where players can move from one title to another with little friction.</p>
<h2>Our goal</h2>
<p>Our goal is to maintain a useful browser game library that is simple for players and respectful toward creators, publishers, and content providers. We regularly improve organization, performance, and moderation tools as freegamezone.io grows.</p>
<h2>Contact information note</h2>
<p>For questions, feedback, copyright concerns, or game removal requests, please use the <a href="/contact-us">Contact us</a> page and include the page URL or game title involved.</p>
$site$,
    'html',
    'content',
    'About us content',
    'HTML content for the About us page.',
    true
  ),
  (
    'privacy_policy_content',
    $site$
<h2>Privacy policy</h2>
<p>This policy explains how Free Game Zone handles basic information related to freegamezone.io, browser game pages, embedded content, and voluntary contact messages.</p>
<h2>Information we collect</h2>
<p>We may collect technical information such as pages visited, browser type, approximate device details, game events, search activity, and basic form details you choose to submit. Favorites, likes, and some contact form messages may be stored locally in your browser.</p>
<h2>How we use information</h2>
<p>We use information to improve navigation, understand which games are useful to players, fix loading issues, respond to messages, measure general performance, and keep the website safe from abuse.</p>
<h2>Cookies and similar technologies</h2>
<p>freegamezone.io may use local storage, cookies, or similar browser technologies for preferences, favorites, likes, analytics, advertising, fraud prevention, and basic site operation.</p>
<h2>Third-party games and external content</h2>
<p>Games may be created by third-party developers or loaded from external providers through embedded frames or external content. When a game or embedded frame loads, the provider may process information under its own policies.</p>
<h2>Advertising</h2>
<p>If advertising is added, advertising partners may use cookies, device information, or similar technologies to measure ad performance, limit repeated ads, provide relevant ads, and prevent fraud.</p>
<h2>Data retention</h2>
<p>We keep website records only as long as reasonably needed for operation, support, moderation, analytics, or legal requests. Browser local storage can be cleared by the user at any time.</p>
<h2>Children's privacy</h2>
<p>Free Game Zone is intended for a general audience. We do not knowingly ask children to submit personal information. If you believe a child has sent personal information, contact us so we can review it.</p>
<h2>Contact</h2>
<p>Questions about privacy, copyright concerns, advertising, third-party content, or removal requests can be sent through the <a href="/contact-us">Contact us</a> page.</p>
$site$,
    'html',
    'content',
    'Privacy policy content',
    'HTML content for the Privacy policy page.',
    true
  ),
  (
    'terms_of_use_content',
    $site$
<h2>Term of use</h2>
<p>These terms describe the basic rules for using Free Game Zone and browsing game pages on freegamezone.io.</p>
<h2>Acceptance of terms</h2>
<p>By using freegamezone.io, you agree to use it in a reasonable way and follow these terms. If you do not agree, you should stop using the website.</p>
<h2>Use of the website</h2>
<p>You may use Free Game Zone for personal entertainment, game discovery, and general browsing. You should not attempt to damage the website, overload public features, bypass security, or interfere with other users.</p>
<h2>Games and third-party content</h2>
<p>Games may be provided by third-party developers, publishers, or external providers through embedded content or links. We do not claim ownership of third-party games or related assets, and game availability may change.</p>
<h2>User conduct</h2>
<p>Please do not submit misleading reports, abusive messages, harmful code, or content that violates the rights of others. Simple feedback and accurate issue reports are welcome.</p>
<h2>Intellectual property</h2>
<p>The website layout, text, and organization belong to Free Game Zone unless otherwise noted. Game names, artwork, embedded content, trademarks, and other third-party materials belong to their respective owners.</p>
<h2>Disclaimer</h2>
<p>Free Game Zone is provided as available. We try to keep pages useful and functional, but we cannot guarantee that every third-party game will always load, remain available, or work on every device.</p>
<h2>Limitation of liability</h2>
<p>To the extent allowed by law, Free Game Zone is not responsible for problems caused by third-party game content, external providers, browser settings, or interruptions outside our control.</p>
<h2>Changes to terms</h2>
<p>We may update these terms as the website changes. The latest version will be posted on this page.</p>
<h2>Contact</h2>
<p>Questions about these terms, copyright issues, third-party content, or game removal requests can be sent through the <a href="/contact-us">Contact us</a> page.</p>
$site$,
    'html',
    'content',
    'Terms of use content',
    'HTML content for the Term of use page.',
    true
  ),
  (
    'copyright_policy_content',
    $site$
<h2>Copyright infringement notice procedure</h2>
<p>Free Game Zone respects intellectual property rights. Some games or media shown on freegamezone.io may be provided by third-party developers, publishers, or external content providers. If you believe a page includes material that should be removed or reviewed, you can contact us with a copyright notice or game removal request.</p>
<h2>How to submit a notice</h2>
<p>Send your request through our <a href="/contact-us">Contact us</a> page. Please write a clear subject, describe the issue, and include the exact freegamezone.io URL of the game page or content you want us to review.</p>
<h2>Required information</h2>
<p>Please include your name, contact email, the copyrighted work or protected material, the page URL on freegamezone.io, and a short explanation of why you believe the content is not authorized. If you represent a rights owner, please mention your relationship to the owner.</p>
<h2>What happens after we receive a notice</h2>
<p>We review notices in a practical and good-faith way. We may ask for more information, update a page, remove a listing, disable access to a game, or contact the relevant third-party provider if needed.</p>
<h2>Counter-notification note</h2>
<p>If you believe content was removed or restricted by mistake, you may contact us with an explanation and supporting information. We will review the message and decide whether the content can be restored or adjusted.</p>
<h2>Contact note</h2>
<p>For faster review, use a subject such as "Copyright notice" or "Game removal request" and include all relevant links in one message.</p>
$site$,
    'html',
    'content',
    'Copyright policy content',
    'HTML content for the copyright infringement notice procedure page.',
    true
  ),
  (
    'contact_page_content',
    $site$
<h2>Contact us</h2>
<p>Use this page to contact Free Game Zone about freegamezone.io feedback, game issues, copyright or removal requests, business inquiries, and general questions.</p>
<h2>General questions</h2>
<p>For general questions or feedback, include a short subject and mention the page or feature you are asking about if it helps explain your message.</p>
<h2>Game issues</h2>
<p>If a game does not load, opens the wrong content, or appears outdated, include the game title, the freegamezone.io page URL, and a short description of what happened.</p>
<h2>Copyright or legal requests</h2>
<p>For copyright issues, provider concerns, or game removal requests, include accurate contact details, the exact page URL involved, and enough context for us to review the request.</p>
<h2>Business inquiries</h2>
<p>For partnerships, provider updates, or business questions, describe the opportunity and the best way to follow up.</p>
$site$,
    'html',
    'content',
    'Contact us page content',
    'HTML content shown above the Contact us form.',
    true
  )
on conflict (key) do update
set
  value = excluded.value,
  value_type = excluded.value_type,
  group_name = excluded.group_name,
  label = excluded.label,
  description = excluded.description,
  is_public = excluded.is_public,
  updated_at = now();

insert into cron_publish_settings (key, value, value_type)
values
  ('cron_publish_enabled', 'false', 'boolean'),
  ('cron_publish_batch_size', '2', 'number'),
  ('cron_publish_max_per_day', '20', 'number'),
  ('cron_publish_interval_label', 'Every 1 hour', 'text'),
  ('cron_publish_require_article', 'true', 'boolean'),
  ('cron_publish_require_meta_description', 'true', 'boolean'),
  ('cron_publish_article_max_tokens', '900', 'number'),
  ('cron_publish_meta_description_max_tokens', '180', 'number'),
  ('cron_publish_category_filter', 'all', 'text'),
  ('cron_publish_last_run_at', '', 'datetime'),
  ('cron_publish_today_count', '0', 'number'),
  ('cron_publish_today_date', '', 'date')
on conflict (key) do update
set
  value = excluded.value,
  value_type = excluded.value_type,
  updated_at = now();

insert into ai_providers (
  provider_key,
  provider_name,
  base_url,
  default_model,
  is_enabled,
  is_default
)
values
  (
    'openai',
    'OpenAI',
    'https://api.openai.com/v1',
    'gpt-4.1-mini',
    false,
    false
  ),
  (
    'gemini',
    'Google Gemini',
    'https://generativelanguage.googleapis.com',
    'gemini-2.5-flash',
    false,
    false
  ),
  (
    'anthropic',
    'Anthropic Claude',
    'https://api.anthropic.com',
    'claude-sonnet-4-5',
    false,
    false
  ),
  (
    'openrouter',
    'OpenRouter',
    'https://openrouter.ai/api/v1',
    'openai/gpt-4.1-mini',
    false,
    false
  )
on conflict (provider_key) do update
set
  provider_name = excluded.provider_name,
  base_url = excluded.base_url,
  default_model = excluded.default_model,
  updated_at = now();

insert into ai_prompt_templates (
  template_key,
  name,
  system_prompt,
  user_prompt,
  is_active
)
values
  (
    'game_seo_description',
    'Game SEO Description',
    'You are an SEO content writer for a browser games website. Write original, helpful, concise content. Do not claim ownership of third-party games. Avoid keyword stuffing.',
    'Write a unique SEO meta description for this game.
Game title: {{title}}
Category: {{category}}
Current short description: {{shortDescription}}
Requirements:
- 140 to 160 characters
- Return only plain text
- No HTML
- Include the game title naturally
- Mention free online browser game naturally',
    true
  ),
  (
    'game_article',
    'Game Article',
    'You are an SEO content writer for a browser games website. Write original, useful content for players. Do not copy other websites. Do not claim ownership of third-party games.',
    'Write an SEO-friendly article for this game.
Game title: {{title}}
Category: {{category}}
Tags: {{tags}}
Current description: {{description}}

Requirements:
- Return clean HTML only.
- Do not wrap output in markdown code fences.
- Do not include <html>, <head>, or <body>.
- Use only: <h2>, <h3>, <p>, <ul>, <ol>, <li>, <strong>, <em>.
- Do not use <h1>.
- Do not use inline styles.
- Do not use script, iframe, image, form, or button tags.
- Article length: 500-900 words if possible.
- The article should be original, helpful, and suitable for SEO.
- Do not claim that Free Game Zone owns the game.
- Do not copy from other websites.

Structure:
<h2>About {{title}}</h2>
<p>...</p>
<h2>How to play {{title}}</h2>
<p>...</p>
<h2>Game features</h2>
<ul>
  <li>...</li>
</ul>
<h2>Why play {{title}}?</h2>
<p>...</p>',
    true
  ),
  (
    'category_description',
    'Category Description',
    'You are an SEO content writer for a browser games website.',
    'Write an SEO-friendly category description.
Category name: {{categoryName}}
Requirements:
- 250-400 words
- Explain what players can expect
- Mention online browser games naturally
- No keyword stuffing.',
    true
  )
on conflict (template_key) do update
set
  name = excluded.name,
  system_prompt = excluded.system_prompt,
  user_prompt = excluded.user_prompt,
  is_active = excluded.is_active,
  updated_at = now();
