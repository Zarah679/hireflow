BEGIN;

CREATE TABLE users (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(100) NOT NULL CHECK (char_length(trim(name)) > 0),
  email VARCHAR(255) NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Recruiter emails are unique regardless of letter casing.
CREATE UNIQUE INDEX users_email_unique_index ON users (lower(email));

CREATE TABLE jobs (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(150) NOT NULL CHECK (char_length(trim(title)) > 0),
  department VARCHAR(100),
  location VARCHAR(150),
  status VARCHAR(20) NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX jobs_user_id_index ON jobs (user_id);

CREATE TABLE candidates (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL CHECK (char_length(trim(name)) > 0),
  email VARCHAR(255) NOT NULL CHECK (char_length(trim(email)) > 0),
  experience_level VARCHAR(50),
  stage VARCHAR(20) NOT NULL DEFAULT 'applied'
    CHECK (stage IN (
      'applied',
      'screening',
      'interview',
      'offer',
      'hired',
      'rejected'
    )),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX candidates_job_id_index ON candidates (job_id);
CREATE INDEX candidates_job_stage_index ON candidates (job_id, stage);

-- Keep updated_at accurate without relying on every API route to set it.
CREATE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER jobs_set_updated_at
BEFORE UPDATE ON jobs
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER candidates_set_updated_at
BEFORE UPDATE ON candidates
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

COMMIT;
