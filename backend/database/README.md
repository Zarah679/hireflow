# HireFlow database

The schema models the core ownership chain:

`users -> jobs -> candidates`

Deleting a user deletes that recruiter's jobs and candidates. Deleting a job
deletes its candidates. API routes must still verify ownership before allowing
either operation.

## Create the local database

From the project root, run:

```sh
createdb hireflow
psql -d hireflow -f backend/database/schema.sql
```

If PostgreSQL was installed with the macOS installer and its commands are not
on your `PATH`, use the full command paths:

```sh
/Library/PostgreSQL/18/bin/createdb hireflow
/Library/PostgreSQL/18/bin/psql -d hireflow -f backend/database/schema.sql
```

The schema intentionally contains no sample users because passwords must be
hashed by the application before they are stored.

## Add development demo data

After initializing the schema, run this from the `backend` directory:

```sh
npm run seed
```

This creates one demo recruiter, four jobs, and candidates across every hiring
stage. Rerunning the command replaces only the account with the email
`demo@hireflow.dev`; it does not change other recruiter accounts. The script
refuses to run when `NODE_ENV=production`.

Demo login:

```text
Email: demo@hireflow.dev
Password: Demo1234!
```
