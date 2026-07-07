# Project Overview

## What This Website Is

Real Capita is a corporate CMS website for Real Capita Group. It combines public
company pages with an admin dashboard for managing existing CMS content.

The current goal is production stabilization and safe Namecheap/cPanel
deployment. Feature expansion is out of scope unless explicitly requested.

## Public Modules

- Homepage: public landing page with CMS-backed home slider and corporate
  content.
- About pages:
  - `/about`
  - `/about/corporate-profile`
  - `/about/mission-vision-values`
- Business verticals:
  - `/business-verticals`
  - `/business-verticals/[slug]`
  - `/business-verticals/[slug]/[projectSlug]`
- Enterprise/project pages: enterprise listings and project detail content are
  powered by enterprise and project records.
- Media:
  - `/media`
  - `/media/news`
  - `/media/photos`
  - `/media/videos`
  - `/media/publication`
  - `/media/blogs`
  - `/media/[slug]`
- Messages:
  - `/message`
  - `/message/former-chairman`
  - `/message/board-of-directors`
  - `/message/board-of-directors/[slug]`
  - The former-chairman route is CMS-configurable. If CMS content is missing or
    inactive, the public route renders existing fallback content so the visible
    navigation link does not lead to a CMS-driven 404.
- Career:
  - `/career`
  - public application form posts to `/api/career/apply`
- Contact:
  - `/contact`
  - public contact form posts to `/api/contact`
- SEO/system:
  - `/robots.txt`
  - `/sitemap.xml`

## Admin Modules

- Login and logout.
- Dashboard.
- News.
- Photos.
- Videos.
- Careers.
- Career applications.
- Contact messages.
- Board directors.
- Popup settings.
- Settings area:
  - about pages
  - account/admin users
  - business verticals
  - client login
  - contact office
  - enterprises
  - former chairman
  - home slider
  - logos
  - SEO
  - social links
- Enterprise projects and business-vertical projects.

Admin pages call `requireAdmin()` in server components or protected API helpers
in route handlers. Admin mutation routes also use same-origin request guarding.

## Placeholder Or Incomplete Modules

These modules are visible or modeled, but should not be treated as complete CMS
features without further implementation approval:

- Public blogs page: visible static placeholder-style content at `/media/blogs`.
- Public publication page: visible static placeholder-style content at
  `/media/publication`.
- Admin blogs page: protected placeholder page at `/admin/blogs`.
- Admin publication page: protected placeholder page at `/admin/publication`.
- Notice models exist in Prisma, but active route files were not present during
  this documentation pass.
- Property, property booking, and property visit request models exist in Prisma,
  but active public/admin route files were not present during this documentation
  pass.

## Production Caveats

- Uploads are local filesystem files under `public/uploads`. They need separate
  backup/restore handling on Namecheap/cPanel.
- Rate limiting is in-memory and single-instance. It resets on app restart and
  does not coordinate across multiple Node.js processes.
- The PostgreSQL provider stack may print an SSL-mode warning for connection
  strings using `prefer`, `require`, or `verify-ca`. Use a provider-approved
  production SSL mode.
- The migration reconciliation keeps the legacy `Video.thumbnailUrl` database
  column from historical migrations. It is intentionally preserved.
- Same-origin admin mutation protection depends on cPanel proxy headers. Test
  `host`, `x-forwarded-host`, and `x-forwarded-proto` behavior after deployment.
