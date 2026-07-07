# Known Issues And Risks

This file lists known risks observed during production-readiness work. Do not add
speculative issues without confirming them in the source or runtime.

## PostgreSQL SSL-Mode Warning

- Severity: Medium.
- Current status: Builds may print a PostgreSQL provider warning that some SSL
  modes such as `prefer`, `require`, or `verify-ca` are treated as `verify-full`
  by the current stack.
- Safe future fix: Confirm the Namecheap/PostgreSQL provider SSL requirement and
  use an explicit supported SSL mode in the production connection string.

## Local Filesystem Uploads

- Severity: High for production operations.
- Current status: Uploads are stored under `public/uploads` on the server
  filesystem.
- Safe future fix: Keep a separate upload backup/restore process for cPanel.
  Later, migrate uploads to durable object storage after a dedicated design and
  migration plan.

## In-Memory Rate Limits

- Severity: Medium.
- Current status: Admin login, contact, and career application endpoints use a
  module-level in-memory rate limiter.
- Safe future fix: Replace with Redis or database-backed rate limiting before
  running multiple Node.js processes or multiple app servers.

## Placeholder Blogs And Publication

- Severity: Low to Medium.
- Current status: `/media/blogs` and `/media/publication` are visible static
  placeholder-style pages. `/admin/blogs` and `/admin/publication` are protected
  placeholder admin pages.
- Safe future fix: Either hide these routes from navigation before production or
  implement the full CMS module in a separate approved feature phase.

## Legacy `Video.thumbnailUrl` Column

- Severity: Low.
- Current status: Historical migrations created a legacy `Video.thumbnailUrl`
  column that is not part of the current Prisma model. The reconciliation
  migration intentionally preserves it to avoid destructive cleanup.
- Safe future fix: Plan a separate non-production-tested cleanup migration only
  if the column is confirmed unused and production data backup/rollback is ready.

## cPanel Same-Origin Proxy Headers

- Severity: Medium.
- Current status: Admin mutation routes rely on same-origin checks using
  `Origin`, `host`, `x-forwarded-host`, and `x-forwarded-proto`.
- Safe future fix: After Namecheap deployment, test admin login/logout and one
  harmless admin save action through the real domain. If proxy headers differ,
  adjust the guard in a focused patch.

## Production Migration Deploy Requires Backup

- Severity: High.
- Current status: The reconciliation migration passed disposable fresh replay and
  idempotency testing, but the important database still requires backup and
  explicit approval before `npx prisma migrate deploy`.
- Safe future fix: Take and verify a production database backup, run deploy in a
  staging clone if possible, then run `npx prisma migrate deploy` only after
  explicit approval.
