# Data Requirements

## Core Entities
- User (email, password hash, role, status, created_at)
- CompanyProfile (name, description, contact info, location, created_by)
- FreelancerProfile (skills, certifications, location, availability, LinkedIn, summary)
- Job (title, description, requirements, location, duration, timing, status, company_id)
- Application (job_id, freelancer_id, note, status, created_at)
- Message (application_id, sender_id, body, created_at)
- AdminAction (action_type, target_id, reason, created_at, actor_id)

## Relationships
- A User has exactly one role: Company or Freelancer.
- CompanyProfile is owned by a Company user and can post many Jobs.
- FreelancerProfile is owned by a Freelancer user and can submit many Applications.
- An Application links a FreelancerProfile to a Job.
- Messages are scoped to a specific Application.
- AdminAction records removals of users or jobs.
