# BrandedCoders — full-stack site (MERN, single folder)

A single-project MERN site for brandedcoders.com: React (Vite) + React Three Fiber
front end, MongoDB/Mongoose + JWT-authenticated API routes as Vercel serverless
functions in `/api`, and an admin CMS for managing services, portfolio projects,
and contact-form messages. One repo, one Vercel project.

## Structure

```
brandedcoders/
  api/            serverless backend (Express-style handlers, Mongoose models)
  src/            React front end (public site + admin CMS)
  scripts/seed.js one-time script to create the admin user + starter content
  vercel.json     routes /api/* to serverless functions, everything else to the SPA
```

## 1. Install

```bash
npm install
```

## 2. Configure environment

```bash
cp .env.example .env
```

- `MONGODB_URI` — create a free cluster at https://www.mongodb.com/atlas, add a
  database user, allow access from anywhere (0.0.0.0/0) or Vercel's IPs, and
  copy the connection string.
- `JWT_SECRET` — any long random string.
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — credentials for the first CMS login.

## 3. Seed the database

Creates the admin user, the 7 services, and 4 sample portfolio projects:

```bash
npm run seed
```

## 4. Run locally

You need the Vercel CLI to run the `/api` serverless functions alongside the
Vite dev server (Vite alone only serves the front end):

```bash
npm install -g vercel
vercel dev
```

This serves both the site and `/api/*` on the same local port. Visit
`http://localhost:3000`, and log into the CMS at `/admin/login`.

## 5. Deploy to Vercel

1. Push this folder to a GitHub repo (or run `vercel` from inside the folder
   to deploy directly without git).
2. Import the repo in Vercel, or run `vercel --prod` from this folder.
3. In the Vercel project's **Settings → Environment Variables**, add
   `MONGODB_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`.
4. Deploy. Vercel builds the Vite front end to `dist/` and deploys everything
   in `api/` as serverless functions automatically — no separate backend
   hosting needed.
5. Run `npm run seed` once from your machine (pointed at the same
   `MONGODB_URI`) to create the admin user and starter content.
6. Point your `brandedcoders.com` domain at the Vercel project under
   **Settings → Domains**.

## CMS

- Public site reads services/portfolio directly from MongoDB via `/api/services`
  and `/api/portfolio` — no redeploy needed to change content.
- `/admin/login` — sign in with the seeded admin account.
- `/admin` — dashboard with counts, and full CRUD for services, portfolio
  projects, and incoming contact messages.
- Change the admin password by seeding a new hash or adding a "change
  password" endpoint before going to production with real client data.

## Notes

- The 3D hero (`src/components/Scene3D.jsx`) uses `@react-three/fiber` +
  `@react-three/drei` — swap the icosahedron/material for your own geometry
  if you want a different mark.
- Contact form submissions are stored in MongoDB (`Message` model) and are
  visible under `/admin/messages`. Wire up an email provider (e.g. Resend or
  Nodemailer via an SMTP relay) inside `api/messages.js` if you also want
  email notifications.
- All admin write routes (`POST`/`PUT`/`DELETE` on services, portfolio, and
  reading messages) require a valid JWT — check `api/middleware/auth.js`.
