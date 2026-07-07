# Real Capita Website

Next.js App Router website for Real Capita Group with Prisma/PostgreSQL-backed CMS and admin modules.

## Local Setup

1. Copy `.env.example` to `.env`.
2. Fill in `DATABASE_URL` and `ADMIN_JWT_SECRET` with local development values.
3. Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Required Environment Variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string used by Prisma. |
| `ADMIN_JWT_SECRET` | Yes | Secret key used to sign and verify admin auth cookies. Use a long random value in production. |
| `NEXT_PUBLIC_SITE_URL` | Yes | Public site origin used by `robots.txt` and `sitemap.xml`. |

Do not commit `.env` or real production secrets.

## Production Validation Commands

Run these before deployment:

```bash
npx prisma validate
npx prisma generate
npm run build
```

This app uses API routes, Prisma, admin auth, and server-rendered pages, so it must be deployed as a Node.js application. Do not deploy it as a static export.

See `DEPLOYMENT.md` for the Namecheap/cPanel deployment checklist.
