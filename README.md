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
