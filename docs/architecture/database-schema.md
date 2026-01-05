# Database Schema

```sql
-- Users
CREATE TABLE users (
  id uuid PRIMARY KEY,
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  role text NOT NULL CHECK (role IN ('company','freelancer','admin')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','disabled')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Company Profiles
CREATE TABLE company_profiles (
  id uuid PRIMARY KEY,
  user_id uuid UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  contact_email text NOT NULL,
  location text
);

-- Freelancer Profiles
CREATE TABLE freelancer_profiles (
  id uuid PRIMARY KEY,
  user_id uuid UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  skills text[] NOT NULL DEFAULT '{}',
  certifications text[] NOT NULL DEFAULT '{}',
  location text,
  availability text,
  linkedin_url text
);

-- Jobs
CREATE TABLE jobs (
  id uuid PRIMARY KEY,
  company_id uuid NOT NULL REFERENCES company_profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  requirements text[] NOT NULL DEFAULT '{}',
  location text,
  duration text,
  timing text,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','closed'))
);

CREATE INDEX jobs_status_idx ON jobs(status);
CREATE INDEX jobs_location_idx ON jobs(location);

-- Applications
CREATE TABLE applications (
  id uuid PRIMARY KEY,
  job_id uuid NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  freelancer_id uuid NOT NULL REFERENCES freelancer_profiles(id) ON DELETE CASCADE,
  note text,
  status text NOT NULL DEFAULT 'applied' CHECK (status IN ('applied','shortlisted','rejected')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX applications_job_idx ON applications(job_id);
CREATE INDEX applications_freelancer_idx ON applications(freelancer_id);

-- Messages
CREATE TABLE messages (
  id uuid PRIMARY KEY,
  application_id uuid NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX messages_application_idx ON messages(application_id);

-- Admin Actions
CREATE TABLE admin_actions (
  id uuid PRIMARY KEY,
  action_type text NOT NULL CHECK (action_type IN ('remove_user','remove_job')),
  target_id uuid NOT NULL,
  reason text,
  actor_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);
```
