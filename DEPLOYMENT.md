# Real Capita Deployment

This project is a dynamic Next.js Node application. It is not a static export.

Use `PRODUCTION_RUNBOOK.md` as the final production execution checklist. This file keeps the general deployment notes and background.

## Required Environment Variables

Set these in the hosting control panel. Do not commit real values.

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string for Prisma. |
| `ADMIN_JWT_SECRET` | Yes | Long random secret for admin JWT cookies. |
| `NEXT_PUBLIC_SITE_URL` | Yes | Public site origin used by `robots.txt` and `sitemap.xml`. |
| `NODE_ENV` | Yes | Set to `production` in cPanel. |
| `PORT` | Yes on cPanel | Provided by the Node.js app runtime. |
| `HOSTNAME` | Optional | Custom bind host for `server.js`; defaults to `127.0.0.1`. |
| `CREATE_ADMIN_EMAIL` | Temporary only | First-admin bootstrap email. Clear after use. |
| `CREATE_ADMIN_PASSWORD` | Temporary only | First-admin bootstrap password. Clear after use. |
| `CREATE_ADMIN_NAME` | Optional temporary | First-admin display name. Clear after use if set. |
| `CREATE_ADMIN_OVERWRITE` | Optional temporary | Set to `true` only when intentionally resetting the configured admin password. |

## Namecheap/cPanel Checklist

1. Create a Node.js app in cPanel.
2. Select a Node version that satisfies `>=20.9.0 <25`.
3. Set the app root to the uploaded project directory, not `public_html`.
4. Set application mode to `production`.
5. Set startup file to `server.js`.
6. Configure environment variables in cPanel.
7. Upload a clean project copy without `.env`, `.next`, `node_modules`, logs, or runtime uploads.
8. Run package installation from cPanel or SSH.
9. Run Prisma client generation.
10. Run the production build.
11. Start or restart the Node.js app.
12. Test public pages.
13. Test admin login.
14. Test one admin save action.
15. Test one admin upload.
16. Test the contact form.
17. Test the career application form.

## Clean Deployment Package

Create deployment packages from a clean copy of the project. Do not include `.env`, `.next`, `node_modules`, `.git`, logs, local backups, temporary files, database dumps, or runtime uploads.

PowerShell example from the project root:

```powershell
$packageRoot = "E:\Siyam\real-capita-package"
$archivePath = "E:\Siyam\real-capita-package.zip"
Remove-Item -Recurse -Force $packageRoot, $archivePath -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path $packageRoot | Out-Null
robocopy . $packageRoot /E /XD .git .next node_modules public\uploads .backup* backup backups /XF .env .env.local .env*.local *.log *.zip *.bak *.backup-* *.dump *.sql tsconfig.tsbuildinfo
Compress-Archive -Path "$packageRoot\*" -DestinationPath $archivePath -Force
```

Upload `real-capita-package.zip` to cPanel and extract it into the Node app root. Upload or restore `public/uploads` separately only when intentionally preserving existing uploads.

## Build Commands

Use `npm ci` when deploying from a clean checkout with `package-lock.json`.

```bash
npm ci
npx prisma generate
npm run build
```

For Namecheap/cPanel Node hosting, use the `server.js` startup file. If running manually after build:

```bash
NODE_ENV=production node server.js
```

The package also keeps `npm run start` for the standard Next.js production server.

## Database Warning

The production database must be reconciled with the Prisma migration history before final launch. Do not casually run `prisma db push`, reset, or destructive migration commands against production.

Phase 3 added an idempotent reconciliation migration so the migration folder can structurally recreate the current schema. This migration must still be tested before production.

Required staging validation:

1. Empty disposable database replay. With Docker running locally, create a throwaway PostgreSQL container:

   ```powershell
   docker run --rm --name realcapita-migration-test -e POSTGRES_HOST_AUTH_METHOD=trust -e POSTGRES_DB=realcapita_migration_test -p 127.0.0.1:55432:5432 -d postgres:16-alpine
   docker exec realcapita-migration-test pg_isready -U postgres -d realcapita_migration_test
   $env:DATABASE_URL="postgresql://postgres@127.0.0.1:55432/realcapita_migration_test?schema=public"
   npx prisma migrate deploy
   npx prisma migrate diff --from-config-datasource --to-schema prisma/schema.prisma --script
   Remove-Item Env:\DATABASE_URL
   docker rm -f realcapita-migration-test
   ```

   The diff should be empty except for the known preserved legacy `Video.thumbnailUrl` column from the historical first migration. Any other diff is a blocker.

   If Docker is not available, use a manually created empty staging database and run the same commands with a temporary shell-only `DATABASE_URL`:

   ```bash
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/EMPTY_TEST_DATABASE?schema=public" npx prisma migrate deploy
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/EMPTY_TEST_DATABASE?schema=public" npx prisma migrate diff --from-config-datasource --to-schema prisma/schema.prisma --script
   ```

2. Clone/current-schema database test. Restore a backup or clone into a non-production database, then run:

   ```bash
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/CLONE_DATABASE?schema=public" npx prisma migrate deploy
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/CLONE_DATABASE?schema=public" npx prisma migrate diff --from-config-datasource --to-schema prisma/schema.prisma --script
   ```

   This should be a no-op/idempotency test for the reconciliation migration. Stop if it tries to drop, rename, or rewrite existing production-derived data.

3. Full application build and smoke test after the migration test.

Take a database backup before any production migration. Do not run the reconciliation migration directly on production first. Never use `prisma db push` or `prisma migrate reset` on production.

Production command sequence, do not run until the staging replay and clone tests pass:

```bash
npm ci
npx prisma generate
npx prisma migrate deploy
npm run build
npm run admin:create
```

For cPanel, the safe order is:

1. Upload and extract the clean package.
2. Configure environment variables in cPanel.
3. Run `npm ci`.
4. Run `npx prisma generate`.
5. Run `npm run build`.
6. After backup and approval, run `npx prisma migrate deploy`.
7. Run `npm run admin:create` with temporary `CREATE_ADMIN_*` variables.
8. Clear temporary admin variables.
9. Start or restart the Node app using `server.js`.
10. Run the smoke-test checklist.

## Production Admin Bootstrap

Do not use default credentials for production. The seed script no longer creates a default admin unless explicit `CREATE_ADMIN_*` environment variables are set.

After staging migration validation passes and a production backup is taken:

1. Set temporary admin bootstrap variables in the shell or cPanel environment:

   ```bash
   export CREATE_ADMIN_EMAIL="<admin-email>"
   export CREATE_ADMIN_PASSWORD="<long-random-password>"
   export CREATE_ADMIN_NAME="<admin-display-name>"
   export CREATE_ADMIN_OVERWRITE=false
   ```

2. Run the dedicated bootstrap command:

   ```bash
   npm run admin:create
   ```

3. Clear the temporary password variable immediately after the admin is created:

   ```bash
   unset CREATE_ADMIN_PASSWORD
   unset CREATE_ADMIN_EMAIL
   unset CREATE_ADMIN_NAME
   unset CREATE_ADMIN_OVERWRITE
   ```

4. Log in to the admin panel and verify access.

Do not commit `.env`, print or share the admin password, or seed production repeatedly without understanding `CREATE_ADMIN_OVERWRITE`. Developers may set local admin bootstrap variables in an uncommitted local `.env` file.

## Upload Warning

Current uploads are stored under `public/uploads` on the local filesystem. Production deployment must preserve and back up this folder carefully. A later phase can move uploads to durable object storage.

## Rollback Checklist

Before production changes, keep:

1. A verified database backup from immediately before `npx prisma migrate deploy`.
2. The previous deployment package or extracted app directory.
3. A backup of `public/uploads`.
4. A copy of the cPanel environment variable names and non-secret settings.

To roll back, restore the previous package, restore `public/uploads` if needed, restore the database backup if migrations or data changes must be reversed, verify environment variables, and restart the Node app.
