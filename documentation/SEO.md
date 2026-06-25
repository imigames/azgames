# SEO

The platform is built for scalable SEO across many game/category pages.

## Metadata

Public pages should use:

- Meta title.
- Meta description.
- Canonical URL.
- Open Graph title/description/image.
- Twitter card metadata.

Page-specific SEO should take priority over global fallback settings.

## Public SEO Files

- `sitemap.xml`: includes homepage, active categories, active games, and public static pages.
- `robots.txt`: allows crawling and points to the sitemap.
- `ads.txt`: lives at `public/ads.txt`.

## JSON-LD Schema

Homepage:

- Organization
- WebSite with SearchAction
- WebPage
- ItemList

Category page:

- CollectionPage
- BreadcrumbList
- ItemList

Game page:

- VideoGame
- WebPage
- BreadcrumbList

## Critical Rules

- Inactive games must not appear in public SEO outputs.
- Do not add fake AggregateRating unless real user vote data exists.
- Do not add fake reviews.
- Do not create Review schema from comments.
- Keep schema data consistent with visible public page content.
- Preserve JSON-LD helpers when redesigning public pages.

