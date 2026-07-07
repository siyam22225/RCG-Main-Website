# Architecture

## Folder Structure

- `src/app` - Next.js App Router pages, layouts, API routes, metadata routes,
  and route-specific client components.
- `src/app/api` - route handlers for public APIs, admin APIs, uploads, forms,
  and CMS data.
- `src/components` - shared layout, admin navigation, UI, media, and enterprise
  components.
- `src/lib` - Prisma client, auth helpers, CMS data helpers, request guards,
  rate limiting, and constants.
- `prisma` - Prisma schema, migrations, and seed script.
- `scripts` - maintenance and bootstrap scripts, including first-admin creation.
- `public` - static assets. Runtime uploads are stored under `public/uploads`
  and are ignored by Git.
- `docs` - project documentation for future maintainers and agents.

## App Router Route Map

Public routes:

- `/`
- `/about`
- `/about/corporate-profile`
- `/about/mission-vision-values`
- `/business-verticals`
- `/business-verticals/[slug]`
- `/business-verticals/[slug]/[projectSlug]`
- `/media`
- `/media/[slug]`
- `/media/news`
- `/media/photos`
- `/media/videos`
- `/media/publication`
- `/media/blogs`
- `/message`
- `/message/former-chairman`
- `/message/board-of-directors`
- `/message/board-of-directors/[slug]`
- `/career`
- `/contact`
- `/robots.txt`
- `/sitemap.xml`

Admin routes:

- `/admin`
- `/admin/login`
- `/admin/news`
- `/admin/news/new`
- `/admin/news/[id]/edit`
- `/admin/photos`
- `/admin/photos/new`
- `/admin/videos`
- `/admin/videos/new`
- `/admin/careers`
- `/admin/career-applications`
- `/admin/applications`
- `/admin/messages`
- `/admin/board-directors`
- `/admin/popup`
- `/admin/blogs`
- `/admin/publication`
- `/admin/enterprise-projects`
- `/admin/business-vertical-projects`
- `/admin/settings`
- `/admin/settings/about-pages`
- `/admin/settings/account`
- `/admin/settings/admin-users`
- `/admin/settings/business-verticals`
- `/admin/settings/client-login`
- `/admin/settings/contact-office`
- `/admin/settings/enterprises`
- `/admin/settings/former-chairman`
- `/admin/settings/home-slider`
- `/admin/settings/logos`
- `/admin/settings/seo`
- `/admin/settings/social`

## API Route Map

Admin APIs under `/api/admin`:

- auth: `/api/admin/login`, `/api/admin/logout`
- board directors: `/api/admin/board-directors`, `/api/admin/board-directors/[id]`
- business verticals: `/api/admin/business-verticals`
- career applications: `/api/admin/career-applications`,
  `/api/admin/career-applications/[id]`
- career page/settings: `/api/admin/career-page-settings`,
  `/api/admin/careers`, `/api/admin/careers/[id]`
- enterprise projects: `/api/admin/enterprise-projects`,
  `/api/admin/enterprise-projects/[id]`
- enterprises: `/api/admin/enterprises`
- former chairman: `/api/admin/former-chairman`
- home slides: `/api/admin/home-slides`
- messages: `/api/admin/messages/[id]`
- news: `/api/admin/news/[id]`
- office settings: `/api/admin/office-settings`
- general settings: `/api/admin/settings`,
  `/api/admin/settings/about-pages`, `/api/admin/settings/client-login`,
  `/api/admin/settings/logos`, `/api/admin/settings/seo`
- site popup: `/api/admin/site-popup`
- social links: `/api/admin/social-links`
- users: `/api/admin/users`

Public and mixed APIs:

- `/api/business-verticals`
- `/api/career/apply`
- `/api/client-login-setting`
- `/api/contact`
- `/api/enterprises`
- `/api/header-settings`
- `/api/home-slides`
- `/api/logo-settings`
- `/api/news`, `/api/news/[id]`
- `/api/office-settings`
- `/api/photos`, `/api/photos/[id]`
- `/api/site-contact-settings`
- `/api/site-popup`
- `/api/social-links`
- `/api/upload`
- `/api/videos`, `/api/videos/[id]`

Some public CMS APIs include admin-protected mutation methods. Do not assume a
route is public just because it is outside `/api/admin`; inspect its handlers.

## Auth Flow

- Admin login posts to `/api/admin/login`.
- Passwords are checked with `bcryptjs`.
- Successful login creates a JWT using `ADMIN_JWT_SECRET`.
- The JWT is stored in an `admin_token` HTTP-only cookie.
- Production cookies use `secure: true` and `sameSite: "lax"`.
- Admin server pages call `requireAdmin()` from `src/lib/require-admin.ts`.
- API routes validate the admin cookie through auth helpers.
- Admin mutation APIs add same-origin checking through
  `src/lib/admin-request-guard.ts`.
- Admin login is intentionally unauthenticated but same-origin protected and
  rate-limited.

## Upload Flow

- Admin CMS uploads post to `/api/upload`.
- Uploads require an authenticated admin cookie and same-origin request.
- Allowed categories:
  - images: JPEG, PNG, WebP, max 5 MB
  - videos: MP4, WebM, QuickTime, max 50 MB
  - documents: PDF, max 10 MB
- Files are saved under:
  - `public/uploads/images`
  - `public/uploads/videos`
  - `public/uploads/documents`
- Career CV uploads post to `/api/career/apply`.
- Career CVs allow PDF, DOC, and DOCX and are saved under
  `public/uploads/career-cvs`.

## Prisma And Database Model Summary

Current Prisma models:

- `News`
- `Photo`
- `Video`
- `Enterprise`
- `ContactMessage`
- `AdminUser`
- `SocialLink`
- `HomeSlide`
- `OfficeSetting`
- `BoardDirector`
- `EnterpriseProject`
- `ClientLoginSetting`
- `WebsiteLogoSetting`
- `BrandLogo`
- `SeoSetting`
- `AboutPageContent`
- `CareerVacancy`
- `CareerApplication`
- `Notice`
- `BusinessVerticalCategory`
- `BusinessVerticalItem`
- `FormerChairmanMessage`
- `CareerPageSetting`
- `NoticeCategory`
- `Property`
- `PropertyBooking`
- `PropertyVisitRequest`
- `SitePopupSetting`

The reconciliation migration at
`prisma/migrations/20260428000650_reconcile_current_schema_baseline` was added
to make fresh migration replay structurally recreate the current schema. Do not
edit older applied migrations.

## Public Layout Flow

- `src/app/layout.tsx` loads global CSS, root metadata, and `SiteChrome`.
- `src/components/layout/SiteChrome.tsx` decides whether to render public chrome
  or admin-only shell based on the current pathname.
- Public pages render:
  - `Header`
  - `SocialSidebar`
  - page content
  - `SitePopup`
  - `Footer`
- Admin routes skip the public header/footer/sidebar/popup chrome.

## Admin Layout Flow

- `src/app/admin/layout.tsx` wraps admin content with an admin route container.
- Individual admin pages call `requireAdmin()`.
- `src/components/admin/AdminNav.tsx` renders the admin navigation and calls
  `/api/admin/logout` on logout.

## Common Utilities

- `src/lib/prisma.ts` - Prisma client using `@prisma/adapter-pg`.
- `src/lib/admin-auth.ts` - JWT creation and verification.
- `src/lib/require-admin.ts` - server component admin gate.
- `src/lib/admin-api-auth.ts` - API admin auth helper.
- `src/lib/admin-request-guard.ts` - same-origin guard for admin mutations.
- `src/lib/rate-limit.ts` - lightweight in-memory rate limiting.
- `src/lib/news.ts`, `src/lib/photos.ts`, `src/lib/videos.ts` - CMS helpers.
- `src/lib/enterprise-projects.ts` - enterprise project helpers.
- `src/lib/about-pages.ts` and `src/lib/board-directors.ts` - page data helpers.
