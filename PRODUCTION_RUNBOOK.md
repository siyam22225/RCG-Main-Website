# Real Capita Production Runbook

This is the final manual execution checklist for deploying the Real Capita Next.js app to Namecheap/cPanel. Do not run production commands until each preflight item is confirmed.

## 1. Pre-Deployment Requirements

- Confirm Namecheap/cPanel supports a Node.js version satisfying `>=20.9.0 <25`.
- Confirm PostgreSQL connection details are ready.
- Confirm the domain or subdomain points to the cPanel Node.js app.
- Confirm the Node app root path.
- Confirm the startup file is `server.js`.
- Confirm the app is deployed as a Node.js app, not a static export.
- Confirm `public/uploads` backup and restore handling before uploading a new app package.
- Confirm the pending Prisma reconciliation migration was already tested on disposable/staging databases.
- Confirm a production database backup can be taken and restored before running migrations.

## 2. Required Environment Variables

Configure these in cPanel. Use real values only in cPanel or the active production shell. Do not commit or print them.

- `DATABASE_URL`
- `ADMIN_JWT_SECRET`
- `NEXT_PUBLIC_SITE_URL`
- `NODE_ENV=production`
- `PORT`
- `HOSTNAME` if cPanel requires a custom bind host

Temporary first-admin bootstrap variables:

- `CREATE_ADMIN_EMAIL`
- `CREATE_ADMIN_PASSWORD`
- `CREATE_ADMIN_NAME`
- `CREATE_ADMIN_OVERWRITE`

Clear all temporary `CREATE_ADMIN_*` variables after the first admin is created.

## 3. Local Package Creation

Create packages from the project root on a clean local copy.

```powershell
$packageRoot = "E:\Siyam\real-capita-package"
$archivePath = "E:\Siyam\real-capita-package.zip"
Remove-Item -Recurse -Force $packageRoot, $archivePath -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path $packageRoot | Out-Null
robocopy . $packageRoot /E /XD .git .next node_modules public\uploads .backup* backup backups /XF .env .env.local .env*.local *.log *.zip *.bak *.backup-* *.dump *.sql tsconfig.tsbuildinfo
Compress-Archive -Path "$packageRoot\*" -DestinationPath $archivePath -Force
```

Confirm the package excludes:

- `.env`
- `.env.local`
- `.env*.local`
- `.next`
- `node_modules`
- `.git`
- logs
- backups
- database dumps
- `public/uploads`

The package must include:

- `package.json`
- `package-lock.json`
- `server.js`
- `next.config.js`
- `prisma/schema.prisma`
- `prisma/migrations`
- `prisma/migrations/20260428000650_reconcile_current_schema_baseline`
- `prisma.config.ts`
- `scripts/create-admin.mjs`
- `src`
- `public` without `public/uploads`

## 4. Upload Handling

- The normal app package must not include `public/uploads`.
- Before redeploying, back up the current server `public/uploads` directory separately.
- On first launch with no previous uploads, create or verify the `public/uploads` path if the upload flow needs it.
- On redeploy, restore `public/uploads` after extracting the clean app package.
- Do not delete server uploads during app package replacement.

## 5. cPanel Deployment Sequence

Execute in this order:

1. Create the Node.js app in cPanel.
2. Set the Node.js version to a version satisfying `>=20.9.0 <25`.
3. Set the app root to the extracted project directory.
4. Set application mode to production.
5. Set startup file to `server.js`.
6. Upload and extract the clean app package.
7. Restore `public/uploads` separately if this is a redeploy.
8. Configure required environment variables in cPanel.
9. Run install.
10. Run Prisma generate.
11. Run build.
12. Take and verify a production database backup.
13. Run migration deploy only after DB backup and explicit approval.
14. Run admin bootstrap with temporary `CREATE_ADMIN_*` variables.
15. Clear temporary admin bootstrap variables.
16. Start or restart the Node.js app.
17. Run smoke tests.
18. Check browser console and server logs.

## 6. Commands

### Install And Build

Use this first:

```bash
npm ci
npx prisma generate
npm run build
```

If npm fails with a certificate verification error on the host, retry install with the system certificate store:

```bash
NODE_OPTIONS=--use-system-ca npm ci --no-audit
npx prisma generate
npm run build
```

### Migration

Run only after DB backup and explicit approval.

```bash
npx prisma migrate deploy
```

Never use these on production:

```bash
npx prisma db push
npx prisma migrate reset
npx prisma migrate dev
```

### Admin Bootstrap

Set temporary variables only for the bootstrap step.

```bash
export CREATE_ADMIN_EMAIL="<admin-email>"
export CREATE_ADMIN_PASSWORD="<long-random-password>"
export CREATE_ADMIN_NAME="<admin-display-name>"
export CREATE_ADMIN_OVERWRITE=false
npm run admin:create
unset CREATE_ADMIN_PASSWORD
unset CREATE_ADMIN_EMAIL
unset CREATE_ADMIN_NAME
unset CREATE_ADMIN_OVERWRITE
```

Do not print or share the password.

### Restart Guidance

Use the cPanel Node.js app restart button, or restart from the cPanel application controls. If running manually:

```bash
NODE_ENV=production node server.js
```

### Smoke Test Commands

Replace `https://example.com` with the production origin.

```bash
curl -fsS -o /dev/null -w "%{http_code}\n" https://example.com/
curl -fsS -o /dev/null -w "%{http_code}\n" https://example.com/about
curl -fsS -o /dev/null -w "%{http_code}\n" https://example.com/business-verticals
curl -fsS -o /dev/null -w "%{http_code}\n" https://example.com/media/news
curl -fsS -o /dev/null -w "%{http_code}\n" https://example.com/career
curl -fsS -o /dev/null -w "%{http_code}\n" https://example.com/contact
curl -fsS -o /dev/null -w "%{http_code}\n" https://example.com/admin/login
curl -fsS -o /dev/null -w "%{http_code}\n" https://example.com/robots.txt
curl -fsS -o /dev/null -w "%{http_code}\n" https://example.com/sitemap.xml
```

## 7. Smoke Test Checklist

Public pages:

- `/`
- `/about`
- `/business-verticals`
- `/media/news`
- `/career`
- `/contact`

Admin:

- Open `/admin/login`.
- Log in with the production admin account.
- Save one harmless setting.
- Create or edit one CMS item only if a reversible test item is acceptable.
- Upload one small image.
- Verify the uploaded file displays.
- Log out.

Forms:

- Submit a contact form test.
- Submit a career application test with a small dummy CV.
- Verify the submissions appear in the admin area.

SEO and system:

- `/robots.txt`
- `/sitemap.xml`
- Browser console check.
- Server logs check.

## 8. Rollback Plan

Before production changes, keep:

- The database backup from immediately before `npx prisma migrate deploy`.
- The previous app package or extracted app directory.
- A backup of `public/uploads`.
- A record of cPanel environment variable names and non-secret settings.

Rollback steps:

1. Stop the Node.js app.
2. Restore the previous app package or extracted directory.
3. Restore the previous `public/uploads` backup if uploads were affected.
4. Restore the database backup if migration or data changes caused the issue.
5. Restore environment variables if they changed.
6. Start or restart the Node.js app.
7. Run the smoke-test checklist again.

## 9. Known Risks

- Uploads are stored on the local filesystem under `public/uploads`; they require separate backup and restore handling.
- In-memory rate limits reset on app restart and may not coordinate across multiple Node processes.
- The PostgreSQL driver currently warns about SSL mode semantics for some connection-string options. Prefer an explicit, provider-approved SSL mode for production.
- Fresh migration replay preserves the legacy `Video.thumbnailUrl` column from historical migrations. This is known and non-destructive.
- Same-origin admin mutation protection depends on correct proxy headers. Test cPanel forwarding of `host`, `x-forwarded-host`, and `x-forwarded-proto`.
- `NODE_OPTIONS=--use-system-ca` may be needed if Namecheap or the local shell has npm certificate verification issues.
- Do not run production migrations until backup, package, uploads, and rollback plans are confirmed.
