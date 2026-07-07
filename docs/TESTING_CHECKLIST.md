# Testing Checklist

Use this checklist before deployment and after production changes. Do not submit
forms, log in, or run admin mutations against an important database unless that
test is explicitly approved.

## Public Page Smoke Test

Verify HTTP status, visible page content, and browser console:

- `/`
- `/about`
- `/about/corporate-profile`
- `/about/mission-vision-values`
- `/business-verticals`
- `/media`
- `/media/news`
- `/media/photos`
- `/media/videos`
- `/media/publication`
- `/media/blogs`
- `/message`
- `/message/former-chairman`
- `/message/board-of-directors`
- `/career`
- `/contact`

## SEO And System Routes

- `/robots.txt`
- `/sitemap.xml`

Confirm both return valid responses for the configured site URL.

## Admin Login Smoke Test

Safe GET-only check:

- `/admin/login`

Deeper checks require a safe local/staging admin and a database where test data
changes are allowed:

- Log in.
- Confirm dashboard loads.
- Log out.
- Confirm protected admin pages redirect or block access when logged out.

## CMS Create/Edit/Delete Checklist

Run only on a disposable or approved staging database:

- News: create, edit, delete.
- Photos: create, edit if available, delete.
- Videos: create, edit if available, delete.
- Careers: create, edit, deactivate or delete.
- Board directors: create or edit one reversible test record.
- Popup: save one harmless setting and revert.
- Settings: save one harmless field and revert.

Do not run destructive tests on production without approval and a rollback plan.

## Upload Checklist

Run only with admin access on a safe database and filesystem:

- Upload one small JPEG/PNG/WebP image.
- Upload one small PDF where document upload is expected.
- Upload one small video only if storage limits allow it.
- Verify upload URLs return the uploaded files.
- Verify oversized or unsupported files are rejected.
- Confirm files land under `public/uploads`.

## Contact Form Checklist

Run only when test submissions are allowed:

- Submit one normal contact message.
- Confirm success response and UI message.
- Confirm the message appears in the admin messages area.
- Confirm repeated submissions eventually hit rate limits.

## Career Application Checklist

Run only when test submissions and CV uploads are allowed:

- Submit an application with a small dummy PDF/DOC/DOCX CV.
- Confirm success response and UI message.
- Confirm the application appears in the admin applications area.
- Confirm oversized or unsupported CV files are rejected.

## Browser Console And Network Checklist

For every smoke-tested page:

- Check console errors.
- Check failed network requests.
- Check obvious broken rendering.
- Check images and uploaded media where relevant.
- Check that public pages are not accidentally showing admin-only content.

## Namecheap/cPanel Post-Deploy Checklist

- Confirm Node.js version satisfies `>=20.9.0 <25`.
- Confirm startup file is `server.js`.
- Confirm environment variables are configured without exposing values.
- Confirm `public/uploads` was restored separately if redeploying.
- Run public page smoke tests.
- Run `/robots.txt` and `/sitemap.xml` checks.
- Test admin login.
- Test one harmless admin save action if approved.
- Test one upload if approved.
- Test contact and career forms if approved.
- Check cPanel server logs.
- Check browser console on desktop and mobile widths.
