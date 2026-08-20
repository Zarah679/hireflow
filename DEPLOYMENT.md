# Deploying HireFlow

HireFlow is prepared to run as one web service with a managed PostgreSQL
database. Express serves both the REST API and the compiled React application,
so the frontend and API share one origin and do not require CORS configuration.

## Production requirements

- Node.js 20 or newer
- PostgreSQL
- A public HTTPS web service

## Environment variables

Set these variables on the web service:

```text
NODE_ENV=production
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
DATABASE_SSL=true
JWT_SECRET=YOUR_LONG_RANDOM_SECRET
```

Most managed PostgreSQL providers require `DATABASE_SSL=true`. Set it to
`false` only when the provider explicitly does not use SSL. Generate a JWT
secret locally with:

```sh
openssl rand -hex 32
```

Do not commit the generated secret or a production database URL.

The hosting provider normally supplies `PORT`; HireFlow uses it automatically.

## Build and start commands

Run the build from the repository root:

```sh
npm ci --prefix backend
npm ci --prefix frontend
npm run build --prefix frontend
```

Start the application from the repository root:

```sh
npm start --prefix backend
```

## Initialize the production database

Run the schema once against a new, empty production database:

```sh
psql "$DATABASE_URL" -f backend/database/schema.sql
```

Do not run `npm run seed` or `npm run populate` in production. Both scripts are
development-only and reject `NODE_ENV=production`.

## Deployment smoke check

After deployment:

1. Open `/api/health` and confirm the response says the database is connected.
2. Open `/` and register a recruiter account.
3. Create a job and candidate.
4. Move the candidate to another pipeline stage and refresh the page.
5. Log out and back in, then confirm the records are still present.

If direct links such as `/app/jobs` return the React application, the SPA
fallback is working correctly.

New passwords must be 8–128 characters and include an uppercase letter,
lowercase letter, number, and special character.
