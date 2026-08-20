# Deploying HireFlow to Render

HireFlow runs as one Render Web Service. Render builds the React/Vite frontend,
then Express serves `frontend/dist` and all `/api` routes from the same origin.

## Render service settings

Create a Render Web Service connected to the repository and use:

```text
Root Directory: leave blank (repository root)
Build Command: npm ci --prefix backend && npm ci --prefix frontend && npm run build --prefix frontend
Start Command: npm start --prefix backend
```

Configure these environment variables:

```text
NODE_ENV=production
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<database>
DATABASE_SSL=<true-or-false>
JWT_SECRET=<long-random-string>
```

Render supplies `PORT` automatically. Use `DATABASE_SSL=true` when the managed
database requires SSL. Generate a JWT secret locally with:

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

## Deployment smoke check

1. Open `https://<render-service-domain>/api/health` and confirm the database is
   connected.
2. Open `https://<render-service-domain>/` and register a recruiter.
3. Create a job and candidate.
4. Refresh `/app`, `/app/jobs`, and `/app/pipeline` to confirm the React Router
   fallback works.
5. Log out and back in, then confirm the records remain available.
