# Deploying HireFlow

HireFlow uses two services in production:

- Vercel hosts the React/Vite frontend.
- Render hosts the Express API.
- PostgreSQL is provided by Render or another managed database provider.

## Render backend

Create a Web Service connected to this repository.

Build command:

```sh
npm ci --prefix backend
```

Start command:

```sh
npm start --prefix backend
```

Configure these environment variables:

```text
NODE_ENV=production
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<database>
DATABASE_SSL=<true-or-false>
JWT_SECRET=<long-random-string>
FRONTEND_URL=https://<vercel-app-domain>
```

Render supplies `PORT` automatically. `FRONTEND_URL` must contain only the
Vercel origin, with no path or trailing slash. Use `DATABASE_SSL=true` when the
database provider requires SSL.

Generate a JWT secret locally with:

```sh
openssl rand -hex 32
```

Do not commit the generated value or any production database credentials.

## Initialize PostgreSQL

Run the schema once against a new production database:

```sh
psql "$DATABASE_URL" -f backend/database/schema.sql
```

Do not run `npm run seed` or `npm run populate` in production. Both scripts are
development-only and reject `NODE_ENV=production`.

## Vercel frontend

Import the repository into Vercel and set the Root Directory to `frontend`.
Vercel will use the existing Vite build configuration.

Configure this environment variable before building:

```text
VITE_API_BASE_URL=https://<render-service-domain>
```

Use the Render service origin only, with no `/api` suffix or trailing slash.
Frontend service calls already add paths such as `/api/auth/login`.

After changing `VITE_API_BASE_URL`, redeploy the frontend because Vite embeds
environment variables at build time.

## Deployment smoke check

1. Open `https://<render-service-domain>/api/health` and confirm the database is
   connected.
2. Open the Vercel application and register a recruiter.
3. Create a job and candidate.
4. Move the candidate to another pipeline stage and refresh the page.
5. Log out and back in, then confirm the records remain available.

If browser requests are blocked by CORS, confirm that Render's `FRONTEND_URL`
exactly matches the deployed Vercel origin, including `https://`.
