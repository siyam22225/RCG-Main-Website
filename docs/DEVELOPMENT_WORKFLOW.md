# Development Workflow

## Local Setup

1. Use a supported Node.js version:

   ```bash
   node -v
   ```

   The project expects `>=20.9.0 <25`.

2. Copy `.env.example` to `.env`.
3. Fill in local development values. Do not commit `.env`.
4. Install dependencies:

   ```bash
   npm ci
   ```

   If npm fails with a certificate verification error on Windows or cPanel,
   retry with the system certificate store:

   ```bash
   NODE_OPTIONS=--use-system-ca npm ci --no-audit
   ```

5. Validate Prisma and generate the client:

   ```bash
   npx prisma validate
   npx prisma generate
   ```

6. Start development:

   ```bash
   npm run dev
   ```

## Required Environment Variable Names

- `DATABASE_URL`
- `ADMIN_JWT_SECRET`
- `NEXT_PUBLIC_SITE_URL`
- `NODE_ENV`
- `PORT`
- `HOSTNAME`
- `CREATE_ADMIN_EMAIL`
- `CREATE_ADMIN_PASSWORD`
- `CREATE_ADMIN_NAME`
- `CREATE_ADMIN_OVERWRITE`

Only the first three are normally required for local app work. The
`CREATE_ADMIN_*` variables are temporary bootstrap inputs.

## Safe Database Workflow

Safe commands:

```bash
npx prisma validate
npx prisma generate
npx prisma migrate status
```

Commands requiring explicit approval and a confirmed target database:

```bash
npx prisma migrate deploy
npx prisma db push
npx prisma migrate reset
npx prisma migrate dev
```

Do not run destructive or schema-changing commands against an important
database. Production migration deploy requires backup and explicit approval.

## Create A Local Admin

Use temporary local environment variables. Never hardcode admin credentials.

PowerShell:

```powershell
$env:CREATE_ADMIN_EMAIL="local-admin@example.com"
$env:CREATE_ADMIN_PASSWORD="<long-local-password>"
$env:CREATE_ADMIN_NAME="Local Admin"
$env:CREATE_ADMIN_OVERWRITE="false"
npm run admin:create
Remove-Item Env:\CREATE_ADMIN_PASSWORD
Remove-Item Env:\CREATE_ADMIN_EMAIL
Remove-Item Env:\CREATE_ADMIN_NAME
Remove-Item Env:\CREATE_ADMIN_OVERWRITE
```

The command creates the admin if missing. It does not overwrite an existing
admin password unless `CREATE_ADMIN_OVERWRITE=true` is set intentionally.

## Development Server

```bash
npm run dev
```

Default URL:

```text
http://localhost:3000
```

`npm run dev` uses Webpack (`next dev --webpack`) because Turbopack previously
failed on this Windows machine with `Access is denied (os error 5)`. Optional
Turbopack testing is still available:

```bash
npm run dev:turbopack
```

If a dev run leaves stale `.next/dev` type files and a later production build
reports errors under `.next/dev/types`, remove only the ignored `.next/dev`
directory and rerun `npm run build`.

## Production Server Locally

Build first:

```bash
npm run build
```

Then start the custom server:

```powershell
$env:NODE_ENV="production"
$env:PORT="3100"
node server.js
```

Open:

```text
http://127.0.0.1:3100
```

Stop the server with Ctrl+C or by stopping the spawned process.

## Validate Before Committing

Run:

```bash
npm audit
npx prisma validate
npx prisma generate
npm run build
node --check server.js
node --check scripts/create-admin.mjs
npx tsc --noEmit --pretty false
```

Also verify:

```bash
git status
```

Do not stage `.env`, `.next`, `node_modules`, `public/uploads`, logs, dumps, or
archives.

## Clean Deployment Package

Use the package workflow documented in `DEPLOYMENT.md` and
`PRODUCTION_RUNBOOK.md`. The package must exclude:

- `.env`
- `.env.local`
- `.env*.local`
- `.next`
- `node_modules`
- `.git`
- logs
- backups
- database dumps
- generated archives
- `public/uploads`

`public/uploads` is handled separately through backup and restore.

## Deployment References

- General deployment documentation: `DEPLOYMENT.md`
- Final production checklist: `PRODUCTION_RUNBOOK.md`
- Known risks: `docs/KNOWN_ISSUES.md`
