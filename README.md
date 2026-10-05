# api

NestJS backend for EnjoyKaDito — PostgreSQL via TypeORM, JWT auth for the CMS.

## Setup

1. Copy `.env.example` to `.env` and fill in your Postgres credentials.
2. Create the database (e.g. `createdb enjoykadito`, or via your Postgres client).
3. `npm install`
4. Create the first admin account (no public signup — accounts are seeded/created this way):
   ```
   npm run seed:admin -- you@example.com yourpassword "Your Name"
   ```
5. `npm run dev` — also wired up as the `api-dev` launch config, port 4000.

`synchronize: true` is on outside production, so the schema (tables in `src/*/​*.entity.ts`) is created/updated automatically on startup — no migrations yet.

## Resources

- **packages** — tour package content. `GET /packages` and `GET /packages/:slug` are public but only return `status: published` records unless the request carries a valid admin token (drafts included then). Create/update/delete require a token.
- **inquiries** — Contact Us / "Request a Quote" submissions. `POST /inquiries` is public; listing and updating status require a token.
- **auth** — `POST /auth/login` with `{ email, password }` returns `{ accessToken, admin }`. Send the token as `Authorization: Bearer <token>` on protected routes.

## Deploying (Railway)

Create a Postgres service and deploy this repo as a service. Set these variables on the API service:

| Variable | Value |
| --- | --- |
| `NODE_ENV` | `production` |
| `JWT_SECRET` | a long random string. The API refuses to start in production without it |
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` (a reference to the Postgres service) |
| `DB_SYNCHRONIZE` | `true` for the first boot so the tables get created; then remove it or set it to `false` |
| `CORS_ORIGIN` | optional: the website address, e.g. `https://your-site.up.railway.app` |

Railway sets `PORT` itself. To load data into the hosted database from your computer, run the seed scripts
with `DATABASE_URL` pointing at the database's public URL (and `DB_SSL=true` if it asks for SSL).
