# Real Capita Website

Real Capita corporate CMS website built with Next.js App Router, TypeScript, Prisma, PostgreSQL, JWT cookie admin authentication, and local filesystem uploads.

The current production goal is to stabilize and safely deploy the existing website. Do not add new features, redesign the UI, or broaden scope unless that work is explicitly requested.

---

## Tech Stack

- Next.js App Router
- TypeScript
- React
- Prisma 7
- PostgreSQL
- JWT cookie admin authentication
- Local uploads under `public/uploads`

---

## Main Features

- Public corporate pages: homepage, about pages, business verticals, enterprise/project pages, media, messages, careers, and contact.
- Admin CMS: dashboard, news, photos, videos, blogs, careers, applications, contact messages, board directors, popup, and settings.
- Configurable settings: SEO, logos, social links, office details, home slider, client login button, former chairman message, and business verticals.
- Portable CMS seed: fresh clones can restore default CMS/site content with `npm run seed:cms`.
- Security hardening: protected admin APIs, same-origin mutation guard, production cookie flags, upload validation, and lightweight in-memory rate limits.

---

## Fresh Clone Setup Summary

A fresh clone needs three things:

1. Source code from GitHub.
2. A valid PostgreSQL database connection in `.env`.
3. Seeded CMS data using `npm run seed` and `npm run seed:cms`.

Runtime uploads under `public/uploads` are ignored by Git. Missing uploaded media should fall back cleanly in the UI, but production uploads still need separate backup/restore handling.

---

## macOS Setup

Use Terminal.

### 1. Clone the repository

```bash
cd ~/Downloads
git clone https://github.com/siyam22225/RCG-Main-Website.git
cd RCG-Main-Website
```

### 2. Create `.env`

```bash
cp .env.example .env
```

Edit `.env` and set at least:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
ADMIN_JWT_SECRET="replace-with-a-long-random-secret"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

CREATE_ADMIN_EMAIL="admin@realcapita.local"
CREATE_ADMIN_PASSWORD="AdminPassword123"
CREATE_ADMIN_NAME="Super Admin"
CREATE_ADMIN_OVERWRITE=false
```

For the current local test database used during development, the format was:

```env
DATABASE_URL="postgresql://rcg:rcg_password@localhost:5433/rcg_main_website?schema=public"
```

Use your actual PostgreSQL credentials.

### 3. Install dependencies

```bash
npm ci
```

### 4. Prepare Prisma and database

```bash
npx prisma validate
npx prisma generate
npx prisma migrate deploy
```

### 5. Seed required data

Create or update the first admin account from the `CREATE_ADMIN_*` values in `.env`:

```bash
npm run seed
```

Restore the portable CMS/site content used by the website:

```bash
npm run seed:cms
```

### 6. Start development

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Admin login:

```text
http://localhost:3000/admin/login
```

Use the admin email/password configured in `.env`.

---

## Windows Setup

Use PowerShell from the project folder.

### 1. Clone the repository

```powershell
cd $HOME\Downloads
git clone https://github.com/siyam22225/RCG-Main-Website.git
cd RCG-Main-Website
```

### 2. Create `.env`

```powershell
Copy-Item .env.example .env
```

Edit `.env` and set at least:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
ADMIN_JWT_SECRET="replace-with-a-long-random-secret"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

CREATE_ADMIN_EMAIL="admin@realcapita.local"
CREATE_ADMIN_PASSWORD="AdminPassword123"
CREATE_ADMIN_NAME="Super Admin"
CREATE_ADMIN_OVERWRITE=false
```

For a local PostgreSQL database, use your own username, password, port, and database name.

### 3. Install dependencies

```powershell
npm ci
```

If `npm ci` fails with a certificate verification error on Windows or shared hosting, retry with the system certificate store:

```powershell
$env:NODE_OPTIONS="--use-system-ca"
npm ci --no-audit
```

### 4. Prepare Prisma and database

```powershell
npx prisma validate
npx prisma generate
npx prisma migrate deploy
```

### 5. Seed required data

Create or update the first admin account from the `CREATE_ADMIN_*` values in `.env`:

```powershell
npm run seed
```

Restore the portable CMS/site content used by the website:

```powershell
npm run seed:cms
```

### 6. Start development

```powershell
npm run dev
```

Open:

```text
http://localhost:3000
```

Admin login:

```text
http://localhost:3000/admin/login
```

Use the admin email/password configured in `.env`.

---

## Required Environment Variables

Set values in `.env` for local development or in the hosting control panel for production. Do not commit real values.

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

---

## Common Commands

```bash
npm ci
npm run dev
npm run dev:turbopack
npx prisma validate
npx prisma generate
npx prisma migrate deploy
npm run seed
npm run seed:cms
npm run build
npm audit
npx tsc --noEmit --pretty false
npm run admin:create
```

---

## Production Mode Locally

After a successful build, run production mode locally.

### macOS/Linux

```bash
NODE_ENV=production PORT=3100 node server.js
```

### Windows PowerShell

```powershell
$env:NODE_ENV="production"
$env:PORT="3100"
node server.js
```

Then open:

```text
http://localhost:3100
```

---

## Documentation Map

- `AGENTS.md` - root instructions for future AI agents and maintainers.
- `docs/PROJECT_OVERVIEW.md` - product/module overview and production caveats.
- `docs/ARCHITECTURE.md` - route, API, auth, upload, layout, and Prisma map.
- `docs/DEVELOPMENT_WORKFLOW.md` - local development and validation workflow.
- `docs/TESTING_CHECKLIST.md` - manual and deployment smoke-test checklist.
- `docs/KNOWN_ISSUES.md` - current risks and safe future fixes.
- `DEPLOYMENT.md` - general Namecheap/cPanel deployment notes.
- `PRODUCTION_RUNBOOK.md` - final production execution checklist.

---

## Security and Deployment Warnings

- Never commit `.env` or real secrets.
- Do not run destructive Prisma commands against production.
- Do not run `prisma db push`, `prisma migrate reset`, or `prisma migrate dev` against production.
- Run `npx prisma migrate deploy` only after backup and explicit approval.
- Uploads are stored on the local filesystem under `public/uploads` and require separate backup/restore handling.
- This app is dynamic and must be deployed as a Node.js app, not a static export.
- `node_modules`, `.next`, `.env`, and runtime uploads should not be committed.

---

## Fresh Clone Verification Checklist

After setup, verify these pages:

```text
/
 /media/blogs
 /business-verticals
 /about/corporate-profile
 /contact
 /admin/login
```

Expected result:

- Homepage content appears.
- Header, footer, social links, and contact information appear.
- Blog listing appears after `npm run seed:cms`.
- Business verticals appear after `npm run seed:cms`.
- Admin login page opens.
- Missing runtime uploaded images show clean fallbacks instead of broken UI.