# Real Capita Website

Real Capita corporate CMS website built with Next.js App Router, TypeScript,
Prisma, PostgreSQL, JWT cookie admin authentication, and local filesystem
uploads.

The current production goal is to stabilize and safely deploy the existing
website. Do not add new features, redesign UI, or broaden scope unless that work
is explicitly requested.

## Tech Stack

- Next.js App Router
- TypeScript
- React
- Prisma 7
- PostgreSQL
- JWT cookie admin auth
- Local uploads under `public/uploads`

## Main Features

- Public corporate pages: homepage, about pages, business verticals,
  enterprise/project pages, media, messages, careers, and contact.
- Admin CMS: dashboard, news, photos, videos, careers, applications, contact
  messages, board directors, popup, and settings.
- Configurable settings: SEO, logos, social links, office details, home slider,
  client login button, former chairman message, and business verticals.
- Security hardening: protected admin APIs, same-origin mutation guard,
  production cookie flags, upload validation, and lightweight in-memory rate
  limits.

## Local Setup

1. Copy `.env.example` to `.env`.

   Command: `cp .env.example .env`

2. Fill in local values for the required environment variables, especially `DATABASE_URL`, `ADMIN_JWT_SECRET`, and `NEXT_PUBLIC_SITE_URL`.

3. Install dependencies.

   Command: `npm ci`

4. Validate Prisma, generate the client, and apply existing migrations.

   Commands:
   `npx prisma validate`
   `npx prisma generate`
   `npx prisma migrate deploy`

5. Seed required data.

   To create the first admin account from the `CREATE_ADMIN_*` values in `.env`:
   `npm run seed`

   To restore the portable CMS/site content used by the website:
   `npm run seed:cms`

6. Start development.

   Command: `npm run dev`

Open `http://localhost:3000`. The default development command uses Webpack for Windows stability. Turbopack remains available with `npm run dev:turbopack`.

## Required Environment Variables

Set values in `.env` for local development or in the hosting control panel for
production. Do not commit real values.

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string used by Prisma. |
| `ADMIN_JWT_SECRET` | Yes | Long random secret used to sign and verify admin JWT cookies. |
| `NEXT_PUBLIC_SITE_URL` | Yes | Public site origin used by `robots.txt` and `sitemap.xml`. |
| `NODE_ENV` | Production | Set to `production` on the host. |
| `PORT` | Production | Provided by the Node.js hosting runtime. |
| `HOSTNAME` | Optional | Bind host for `server.js`; defaults to `127.0.0.1`. |
| `CREATE_ADMIN_EMAIL` | Temporary | First-admin bootstrap email. |
| `CREATE_ADMIN_PASSWORD` | Temporary | First-admin bootstrap password. |
| `CREATE_ADMIN_NAME` | Optional temporary | First-admin display name. |
| `CREATE_ADMIN_OVERWRITE` | Optional temporary | Set to `true` only for an intentional admin password reset. |

## Common Commands

```bash
npm ci
npm run dev
npm run dev:turbopack
npx prisma validate
npx prisma generate
npm run build
npm audit
npx tsc --noEmit --pretty false
npm run admin:create
```

If `npm ci` fails with a certificate verification error on Windows or
Namecheap, retry with the system certificate store:

```bash
NODE_OPTIONS=--use-system-ca npm ci --no-audit
```

Run production mode locally after a successful build:

```powershell
$env:NODE_ENV="production"
$env:PORT="3100"
node server.js
```

## Documentation Map

- `AGENTS.md` - root instructions for future AI agents and maintainers.
- `docs/PROJECT_OVERVIEW.md` - product/module overview and production caveats.
- `docs/ARCHITECTURE.md` - route, API, auth, upload, layout, and Prisma map.
- `docs/DEVELOPMENT_WORKFLOW.md` - local development and validation workflow.
- `docs/TESTING_CHECKLIST.md` - manual and deployment smoke-test checklist.
- `docs/KNOWN_ISSUES.md` - current risks and safe future fixes.
- `DEPLOYMENT.md` - general Namecheap/cPanel deployment notes.
- `PRODUCTION_RUNBOOK.md` - final production execution checklist.

## Security And Deployment Warnings

- Never commit `.env` or real secrets.
- Do not run destructive Prisma commands against production.
- Do not run `prisma db push`, `prisma migrate reset`, or `prisma migrate dev`
  against production.
- Run `npx prisma migrate deploy` only after backup and explicit approval.
- Uploads are stored on the local filesystem under `public/uploads` and require
  separate backup/restore handling.
- This app is dynamic and must be deployed as a Node.js app, not a static export.
