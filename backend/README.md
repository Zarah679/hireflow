# HireFlow backend

## Setup

1. Install the dependencies:

   ```sh
   npm install
   ```

2. Copy `.env.example` to `.env` and replace `your_password` with your local
   PostgreSQL password. If your PostgreSQL user is not named `postgres`, update
   that part of the connection string too. Generate a JWT secret with
   `openssl rand -hex 32` and use the result as `JWT_SECRET`.

3. Create and initialize the database using the instructions in
   [`database/README.md`](database/README.md).

4. Start the development server:

   ```sh
   npm run dev
   ```

5. Open `http://localhost:5001/api/health`. A working database connection
   returns:

   ```json
   {
     "status": "ok",
     "database": "connected"
   }
   ```

## Structure

- `src/server.js` starts and stops the HTTP server.
- `src/app.js` configures Express and defines routes.
- `src/db.js` creates the shared PostgreSQL connection pool.
- `src/routes/authRoutes.js` handles recruiter registration and login.
- `src/middleware/requireAuth.js` verifies JWTs for protected routes.
- `database/schema.sql` defines the database tables and constraints.

## Authentication endpoints

### Register

`POST /api/auth/register`

```json
{
  "name": "Amina Bello",
  "email": "amina@example.com",
  "password": "password123"
}
```

### Login

`POST /api/auth/login`

```json
{
  "email": "amina@example.com",
  "password": "password123"
}
```

Both successful responses include the recruiter and a JWT. Send that token to
protected endpoints using `Authorization: Bearer <token>`.

## Job endpoints

All job endpoints require the JWT in the `Authorization` header. Each database
query also checks the authenticated recruiter's ID to enforce ownership.

- `GET /api/jobs` lists the recruiter's jobs.
- `POST /api/jobs` creates a job.
- `GET /api/jobs/:id` returns one job.
- `PATCH /api/jobs/:id` updates one or more supplied fields.
- `DELETE /api/jobs/:id` deletes a job and returns status `204`.

Create-job request example:

```json
{
  "title": "Frontend Developer",
  "department": "Engineering",
  "location": "Lagos",
  "status": "open"
}
```

## Candidate endpoints

All candidate endpoints require authentication. Candidate access is authorized
through the job that owns the candidate.

- `GET /api/jobs/:jobId/candidates` lists candidates for an owned job.
- `POST /api/jobs/:jobId/candidates` adds a candidate to an owned job.
- `GET /api/candidates/:id` returns one candidate.
- `PATCH /api/candidates/:id` updates candidate details or pipeline stage.
- `DELETE /api/candidates/:id` deletes a candidate and returns status `204`.

Create-candidate request example:

```json
{
  "name": "Tomi Adeyemi",
  "email": "tomi@example.com",
  "experience_level": "mid-level",
  "stage": "applied",
  "notes": "Strong portfolio"
}
```

## Dashboard endpoint

`GET /api/dashboard` returns the authenticated recruiter's lightweight metrics,
candidate totals grouped by stage, and five most recent jobs with candidate
counts. This keeps the dashboard to one API request without introducing a
separate analytics system.

## Production

In production, the backend runs as an API-only Render service. The separately
deployed Vercel origins are allowed through `FRONTEND_URLS`. See
[`../DEPLOYMENT.md`](../DEPLOYMENT.md) for environment variables, build
commands, database initialization, and the deployment smoke check.
