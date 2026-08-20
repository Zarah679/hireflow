# HireFlow

HireFlow is a lightweight full-stack Applicant Tracking System for recruiters and hiring teams. It is an internal recruitment tool, not a public job board.

## Stack

Use:

* React
* JavaScript
* Vite
* Tailwind CSS
* React Router
* Node.js
* Express.js
* PostgreSQL
* JWT authentication
* bcrypt for password hashing

Do not introduce TypeScript, Next.js, Prisma, Firebase, Supabase, Redux, or other major frameworks/libraries unless explicitly requested.

## Core Model

The main relationship is:

Recruiter → Jobs → Candidates

A recruiter creates job openings and manages candidates who applied for those jobs.

Candidate stages:

* applied
* screening
* interview
* offer
* hired
* rejected

Job statuses:

* open
* closed

Suggested database structure:

### users

* id
* name
* email
* password_hash
* created_at

### jobs

* id
* user_id
* title
* department
* location
* status
* created_at
* updated_at

### candidates

* id
* job_id
* name
* email
* experience_level
* stage
* notes
* created_at
* updated_at

## Core Features

The MVP includes:

* Recruiter registration
* Recruiter login/logout
* JWT authentication
* Protected routes
* Create/view/edit jobs
* Open/close jobs
* Add/view/edit/delete candidates
* Candidate notes
* Candidate search
* Candidate filtering
* Candidate sorting
* Kanban-style hiring pipeline
* Update candidate stage
* Dashboard statistics
* Candidate detail modal/drawer
* Loading, error, and empty states

Drag-and-drop may be added only after the core pipeline works.

## Business Rules

* Recruiters may only access their own jobs.
* Recruiters may only access candidates belonging to their jobs.
* Backend authorization must enforce ownership.
* Candidate stage values must be validated.
* Job status values must be validated.
* A candidate must belong to a valid job.
* Moving a candidate through the pipeline updates their database record.

Use PATCH for partial resource updates where appropriate.

## REST API Direction

Prefer simple REST endpoints.

Authentication:

* POST /api/auth/register
* POST /api/auth/login

Jobs:

* GET /api/jobs
* POST /api/jobs
* GET /api/jobs/:id
* PATCH /api/jobs/:id
* DELETE /api/jobs/:id

Candidates:

* GET /api/jobs/:jobId/candidates
* POST /api/jobs/:jobId/candidates
* GET /api/candidates/:id
* PATCH /api/candidates/:id
* DELETE /api/candidates/:id

## Coding Guidelines

The developer must be able to explain the code in interviews.

Therefore:

* Prefer simple, readable JavaScript.
* Avoid clever abstractions.
* Use descriptive names.
* Use async/await.
* Keep functions reasonably small.
* Handle errors explicitly.
* Do not over-engineer.
* Do not rewrite working code unnecessarily.
* Reuse components where sensible.
* Avoid unnecessary dependencies.
* Explain important architecture or unfamiliar concepts briefly when implementing them.

Use React state/hooks unless more complex state management is explicitly requested.

## Authentication

JWTs should be sent with protected API requests using:

Authorization: Bearer <token>

The backend must verify the JWT and use the authenticated user's identity when authorizing access.

Frontend route protection is for UX and must not be treated as backend security.

## Scope Restrictions

Do not add unless explicitly requested:

* CV parsing
* AI scoring/ranking
* Email automation
* Calendar integrations
* File uploads
* Resume storage
* Public job browsing
* Public job applications
* Company teams
* Multiple recruiter roles
* Admin/super-admin systems
* Real-time notifications
* WebSockets
* Complex analytics
* Payments
* Chat/messaging

## Development Philosophy

Prioritize a complete working vertical slice over lots of unfinished features.

Build the simplest correct implementation first, then polish.

Before introducing a significant architectural change, dependency, or out-of-scope feature, explain the reason and wait for explicit direction.

Treat this file and AGENTS.md as the project source of truth unless the developer explicitly overrides them.
