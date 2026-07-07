# Agent Instructions

## Project Identity

This repository is the Real Capita corporate CMS website. It is a production
Next.js App Router project with public corporate pages, a Prisma/PostgreSQL
database, an admin dashboard, JWT cookie authentication, and local filesystem
uploads.

## Tech Stack

- Next.js App Router
- TypeScript
- React
- Prisma
- PostgreSQL
- JWT cookie admin auth
- Local uploads under `public/uploads`

## Current Production Goal

Stabilize, document, test, and safely deploy the existing website. Do not add
new product features or redesign UI unless the user explicitly asks for that
work.

## Absolute Rules

- Do not print, expose, or commit secrets.
- Do not commit `.env`, `.env.local`, `.env*.local`, `.next`, `node_modules`,
  `public/uploads`, logs, database dumps, or deployment archives.
- Do not run destructive Prisma commands.
- Do not run `prisma db push` against production.
- Do not run broad refactors without approval.
- Do not expand features without approval.
- Keep patches small, scoped, and reviewable.
- Do not modify Prisma schema or migrations unless the phase explicitly allows it.
- Run validation after changes.
- If a command would modify the important database, stop and get explicit
  approval first.

## Safe Commands

These are generally safe in this repo:

```bash
npm ci
npm run dev
npx prisma validate
npx prisma generate
npm run build
npm audit
npx tsc --noEmit --pretty false
node --check server.js
node --check scripts/create-admin.mjs
```

`npm run build` may read from the configured database through server-rendered
routes. It must not write data.

`npm run dev` intentionally uses `next dev --webpack` for Windows local
stability. `npm run dev:turbopack` exists only as an optional diagnostic path
because Turbopack previously failed on this machine with `Access is denied (os
error 5)`.

## Dangerous Commands Requiring Explicit Approval

Do not run these unless the user explicitly approves the exact target database
and command:

```bash
npx prisma migrate deploy
npx prisma db push
npx prisma migrate reset
npx prisma migrate dev
npm audit fix
git push --force
```

Production migration deploy is allowed only after a verified database backup,
staging validation, and explicit approval.

## Required Validation Checklist

Before committing any code or documentation change, run:

```bash
npm audit
npx prisma validate
npx prisma generate
npm run build
node --check server.js
node --check scripts/create-admin.mjs
npx tsc --noEmit --pretty false
```

For deployment work, also review:

- `DEPLOYMENT.md`
- `PRODUCTION_RUNBOOK.md`
- `.gitignore`
- `.env.example`

## GitHub Workflow

1. Inspect status first:

   ```bash
   git status
   git remote -v
   git log --oneline -3
   ```

2. Avoid staging ignored or runtime files.
3. Confirm no secrets or generated artifacts are staged.
4. Commit small logical changes.
5. Push only when the user asks or approves.

## Documentation Source Of Truth

- Use `README.md` for developer onboarding.
- Use `docs/PROJECT_OVERVIEW.md` for module inventory.
- Use `docs/ARCHITECTURE.md` for route/API/auth/database maps.
- Use `docs/DEVELOPMENT_WORKFLOW.md` for local workflows.
- Use `docs/TESTING_CHECKLIST.md` for smoke testing.
- Use `docs/KNOWN_ISSUES.md` for current caveats.
- Use `PRODUCTION_RUNBOOK.md` for production execution.

## Generated File Hygiene

- `.next` is ignored runtime/build output and must not be committed.
- If a local dev run leaves stale `.next/dev` type files and the production
  build reports type errors from `.next/dev/types`, delete only the ignored
  `.next/dev` directory and rerun the build.
- Do not commit `public/uploads`; it is runtime media data and must be backed up
  or restored separately.
