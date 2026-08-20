# HireFlow

HireFlow is a lightweight full-stack applicant tracking system for recruiters.
It provides one workspace for managing job openings, candidates, recruitment
notes, and movement through a six-stage hiring pipeline.

## Core features

- Recruiter registration, login, logout, and persisted JWT authentication
- Password strength validation and bcrypt password hashing
- Recruiter-level ownership protection for jobs and candidates
- Dashboard metrics for open jobs, total candidates, interviews, and hires
- Job creation, editing, opening/closing, filtering, and deletion
- Candidate creation, editing, deletion, stage changes, and recruitment notes
- Pipeline views for Applied, Screening, Interview, Offer, Hired, and Rejected
- Candidate search, job/stage filters, and sorting
- Loading, error, empty, confirmation, and success states
- Development starter data for newly registered local accounts

## Tech stack

| Area | Technologies |
| --- | --- |
| Frontend | React, JavaScript, React Router, Vite, Tailwind CSS |
| Backend | Node.js, Express.js, REST APIs |
| Database | PostgreSQL with `pg` |
| Authentication | JSON Web Tokens and bcrypt |

## Architecture

```text
React client
    │  HTTP /api requests with Bearer JWT
    ▼
Express REST API
    │  parameterized SQL and ownership checks
    ▼
PostgreSQL
```

Frontend API calls are centralized under `frontend/src/services` and
`frontend/src/lib/api.js`. Express routes validate requests, authenticate JWTs,
and enforce ownership before querying PostgreSQL. In production, Express serves
the compiled React application and API from the same origin.

Key directories:

```text
backend/
  database/          PostgreSQL schema and development data scripts
  src/routes/        Auth, dashboard, job, and candidate routes
  src/middleware/    JWT authentication middleware
frontend/
  src/components/    Shared interface components
  src/context/       Authentication and toast state
  src/pages/         Landing, auth, dashboard, jobs, pipeline, candidates
  src/services/      API service functions
```

## Database relationships

```text
users 1 ───────< jobs 1 ───────< candidates
```

- Each job belongs to one recruiter through `jobs.user_id`.
- Each candidate belongs to one job through `candidates.job_id`.
- Deleting a user cascades to their jobs and candidates.
- Deleting a job cascades to its candidates.
- Job status is constrained to `open` or `closed`.
- Candidate stage is constrained to `applied`, `screening`, `interview`,
  `offer`, `hired`, or `rejected`.

Backend queries also verify ownership; database relationships are not treated
as a substitute for authorization.

## API endpoints

All endpoints except registration, login, and health require:

```text
Authorization: Bearer <token>
```

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Check API and database availability |
| `POST` | `/api/auth/register` | Create a recruiter account |
| `POST` | `/api/auth/login` | Authenticate and receive a JWT |
| `GET` | `/api/dashboard` | Return dashboard metrics and recent jobs |
| `GET` | `/api/jobs` | List the recruiter's jobs |
| `POST` | `/api/jobs` | Create a job |
| `GET` | `/api/jobs/:id` | Return one owned job |
| `PATCH` | `/api/jobs/:id` | Partially update an owned job |
| `DELETE` | `/api/jobs/:id` | Delete an owned job |
| `GET` | `/api/jobs/:jobId/candidates` | List candidates for an owned job |
| `POST` | `/api/jobs/:jobId/candidates` | Add a candidate to an owned job |
| `GET` | `/api/candidates/:id` | Return one owned candidate |
| `PATCH` | `/api/candidates/:id` | Partially update an owned candidate |
| `DELETE` | `/api/candidates/:id` | Delete an owned candidate |

## Local setup

### Prerequisites

- Node.js 20 or newer
- npm
- PostgreSQL and the `createdb`/`psql` command-line tools

### 1. Install dependencies

From the repository root:

```sh
npm install --prefix backend
npm install --prefix frontend
```

### 2. Configure the backend environment

Copy the example file:

```sh
cp backend/.env.example backend/.env
```

Use local values in `backend/.env`. The required variables are:

```text
PORT=<backend-port>
NODE_ENV=<environment>
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<database>
DATABASE_SSL=<true-or-false>
JWT_SECRET=<long-random-string>
```

Use `DATABASE_SSL=false` for a typical local PostgreSQL installation. Never
commit `.env` or place production credentials in the repository.

### 3. Initialize PostgreSQL

Create the database and apply the schema from the repository root:

```sh
createdb hireflow
psql -d hireflow -f backend/database/schema.sql
```

The schema creates the users, jobs, and candidates tables, constraints,
indexes, cascading relationships, and automatic `updated_at` triggers.

### 4. Run the backend

```sh
cd backend
npm run dev
```

The default local API address is `http://localhost:5001`. Confirm the database
connection at `http://localhost:5001/api/health`.

### 5. Run the frontend

In a second terminal:

```sh
cd frontend
npm run dev
```

Open the URL printed by Vite. During development, Vite proxies `/api` requests
to the backend on port `5001`.

## Production build

From the repository root:

```sh
npm ci --prefix backend
npm ci --prefix frontend
npm run build --prefix frontend
npm start --prefix backend
```

Set `NODE_ENV=production` and configure the production database and JWT secret
through the hosting provider. See [DEPLOYMENT.md](DEPLOYMENT.md) for the full
deployment checklist.

## Future improvements

Potential follow-up work, not currently implemented:

- Automated API and component tests
- Database migrations for schema changes after the initial release
- Optional drag-and-drop interactions for the pipeline
- CI checks and automated deployment workflows
