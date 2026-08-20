# HireFlow — Project Instructions

## Project Overview

HireFlow is a lightweight full-stack Applicant Tracking System (ATS) for recruiters and hiring teams.

It is an internal recruitment management tool, not a public job board.

Recruiters use HireFlow to:

* Register and log in
* Create and manage job openings
* Add candidates to specific jobs
* Track candidates through a hiring pipeline
* Add and edit candidate notes
* Search, filter, and sort candidates
* View basic recruitment statistics
* Move candidates between hiring stages

The main recruitment stages are:

* Applied
* Screening
* Interview
* Offer
* Hired
* Rejected

Rejected is treated as an outcome that a candidate can move to from different stages rather than as a required linear step.

---

## Tech Stack

Use the following stack unless explicitly instructed otherwise:

### Frontend

* React
* JavaScript
* Vite
* Tailwind CSS
* React Router

### Backend

* Node.js
* Express.js
* REST API architecture

### Database

* PostgreSQL

### Authentication

* JWT-based authentication
* Password hashing using bcrypt

Do not introduce TypeScript, Next.js, Prisma, Firebase, Supabase, or another framework/database abstraction unless explicitly requested.

---

## Core Data Model

The main relationship is:

Recruiter → Jobs → Candidates

### Users

A user represents a recruiter using HireFlow.

Suggested fields:

* id
* name
* email
* password_hash
* created_at

### Jobs

Each job belongs to a recruiter.

Suggested fields:

* id
* user_id
* title
* department
* location
* status
* created_at
* updated_at

Job status should initially support:

* open
* closed

### Candidates

Each candidate belongs to a job.

Suggested fields:

* id
* job_id
* name
* email
* experience_level
* stage
* notes
* created_at
* updated_at

Candidate stages:

* applied
* screening
* interview
* offer
* hired
* rejected

---

## Business Rules

1. Recruiters must authenticate before accessing the application.

2. Recruiters should only access jobs that belong to their own account.

3. Recruiters should only access candidates belonging to their own jobs.

4. A candidate must belong to a valid job.

5. A candidate must have:

   * name
   * email
   * job
   * stage

6. Candidate stage values must be validated.

7. Job status values must be validated.

8. Moving a candidate between pipeline stages should update their database record.

9. Editing a candidate should use partial updates where appropriate.

10. Deleting or modifying a resource must verify that the logged-in recruiter owns that resource.

Do not rely on frontend checks for authorization. Ownership and authorization must also be enforced by the backend.

---

## Main Application Areas

Keep the MVP focused on four primary areas.

### 1. Authentication

* Register
* Login
* Logout
* Persist authentication
* Protected frontend routes
* Protected backend routes

### 2. Dashboard

Show lightweight recruitment metrics using existing data.

Suggested metrics:

* Open jobs
* Total candidates
* Candidates currently interviewing
* Hired candidates

The dashboard may also show recent candidates.

Do not build complex analytics infrastructure.

### 3. Jobs

Recruiters can:

* View jobs
* Create jobs
* Edit jobs
* Open or close jobs
* Select a job to view its candidates

### 4. Candidate Pipeline

For a selected job, display candidates using a Kanban-style recruitment pipeline.

Columns should represent:

* Applied
* Screening
* Interview
* Offer

Hired and Rejected may be represented as final outcomes or additional views where appropriate.

Recruiters can:

* Add a candidate
* View candidate details
* Edit candidate information
* Delete candidates
* Update candidate stage
* Add/edit notes
* Search candidates
* Filter candidates
* Sort candidates

Drag-and-drop is optional. The core application must work without it.

---

## API Direction

Prefer clear REST endpoints.

Example structure:

### Authentication

POST /api/auth/register

POST /api/auth/login

### Jobs

GET /api/jobs

POST /api/jobs

GET /api/jobs/:id

PATCH /api/jobs/:id

DELETE /api/jobs/:id

### Candidates

GET /api/jobs/:jobId/candidates

POST /api/jobs/:jobId/candidates

GET /api/candidates/:id

PATCH /api/candidates/:id

DELETE /api/candidates/:id

Do not create unnecessary endpoints when existing REST operations are sufficient.

---

## Code Style

The developer working on this project is learning and must be able to explain the code in a technical interview.

Therefore:

* Prefer readable code over clever code.
* Use descriptive variable and function names.
* Avoid unnecessary abstractions.
* Avoid deeply nested logic.
* Avoid advanced patterns unless they solve a real problem.
* Keep functions reasonably small.
* Use async/await for asynchronous operations.
* Handle errors explicitly.
* Add comments only where they clarify non-obvious logic.
* Do not generate large amounts of boilerplate without explaining the important structure.
* Reuse components where it clearly improves maintainability.
* Do not over-componentize trivial markup.

When implementing an important concept such as authentication, authorization, database relationships, middleware, or API architecture, keep the implementation straightforward enough for the developer to understand and explain.

---

## Frontend Guidelines

Use a simple component structure.

Possible components include:

* Navbar
* Sidebar
* StatCard
* JobCard
* JobForm
* CandidateCard
* CandidateForm
* CandidateDetails
* PipelineBoard
* PipelineColumn
* SearchBar
* FilterControls
* ConfirmDialog

Do not create a separate page for every small interaction.

Prefer modals or drawers for:

* Adding candidates
* Editing candidates
* Candidate details
* Adding/editing jobs where appropriate

Keep the number of main screens small.

---

## State and API Handling

Keep frontend state management simple.

Use React state and hooks unless the application clearly requires something more complex.

Do not introduce Redux, Zustand, React Query, or other state-management libraries unless explicitly requested.

API calls should be centralized where sensible, for example:

* api.js
* authService.js
* jobService.js
* candidateService.js

Authentication requests should automatically include the JWT when required.

---

## Authentication Rules

After successful login:

* Store the authentication token consistently.
* Maintain the authenticated user state.
* Send the token in protected requests using:

Authorization: Bearer <token>

The backend must:

* Verify the JWT
* Determine the authenticated user's identity
* Check ownership before returning or modifying protected resources

Never treat hiding frontend routes as sufficient security.

---

## MVP Scope Guardrails

Do not add these features unless explicitly requested:

* CV parsing
* AI candidate scoring
* AI candidate ranking
* Automated emails
* Calendar integrations
* Interview scheduling systems
* Real file uploads
* Resume storage
* Multiple company accounts
* Company teams
* Complex recruiter permissions
* Admin/super-admin roles
* Real-time notifications
* WebSockets
* Complex analytics
* Charts requiring new analytics infrastructure
* Public job application portal
* Public job browsing
* Payments
* Messaging/chat
* Third-party authentication

If a requested feature significantly increases scope, explain the tradeoff before implementing it.

---

## Development Priority

Build in this order where practical:

1. Project setup
2. Database connection
3. Database schema
4. Express server
5. Basic jobs API
6. Basic candidates API
7. React interface
8. Connect frontend to backend
9. Candidate pipeline
10. Authentication
11. Ownership protection
12. Search/filter/sort
13. Dashboard statistics
14. Error/loading/empty states
15. UI polish
16. Deployment

Prioritize a working vertical slice over completing many disconnected features.

A strong early milestone is:

A recruiter can create a job, add a candidate through React, Express receives the request, PostgreSQL stores the candidate, and the candidate remains visible after refresh.

---

## AI Assistant Rules

When helping with this project:

1. Do not change the agreed tech stack without permission.
2. Do not expand project scope without permission.
3. Do not silently introduce new dependencies.
4. Before making a major architectural change, explain why it is necessary.
5. Prefer the simplest implementation that satisfies the requirement.
6. Preserve existing working functionality when editing code.
7. Do not rewrite large working sections unnecessarily.
8. When fixing bugs, identify the cause before replacing code.
9. Keep the developer able to explain every major feature.
10. When generating code for an unfamiliar concept, briefly explain the important logic.
11. Do not fabricate backend responses, database fields, or requirements that conflict with this document.
12. Treat this file as the source of truth for HireFlow unless the developer explicitly overrides it.
