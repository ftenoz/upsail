# Maritime Expert Marketplace MVP Product Requirements Document (PRD)

## Goals and Background Context

### Goals
- Validate demand by enabling a real company to post a job and initiate a real conversation with a qualified maritime expert within 30 days
- Deliver a trust-oriented, low-risk workflow for posting, applying, shortlisting, and messaging in a narrow maritime context
- Provide a professional, domain-specific profile and job structure that improves visibility and credibility over ad-hoc networking
- Keep scope lean (no payments, ratings, subscriptions, or AI matching) to optimize for speed-to-learning and manual ops

### Background Context
Maritime companies currently source short-term experts through informal networks, WhatsApp groups, and phone calls, which is slow, opaque, and difficult to scale. Generic freelancer platforms don’t meet the trust, certification, and professional expectations of this industry. A focused marketplace can reduce sourcing friction by structuring profiles, jobs, and messaging around maritime-specific needs while keeping the experience minimal and corporate-friendly.

The MVP’s purpose is narrow: prove that a company is willing to post a job and engage a qualified stranger through a simple, trusted platform. Anything that doesn’t directly contribute to that outcome is intentionally out of scope.

### Change Log
| Date | Version | Description | Author |
| --- | --- | --- | --- |
| 2026-01-04 | v0.1 | Initial PRD draft created from Project Brief | John (PM) |

## Requirements## Market & Competitive Context
- Maritime expert hiring is dominated by informal networks (referrals, WhatsApp, phone) rather than structured platforms.
- Generic freelancer marketplaces lack domain-specific trust signals (certifications, availability, maritime experience) and feel risky for corporate users.
- The MVP differentiator is a narrow, professional workflow that emphasizes credibility and reduces perceived liability.

## User Flows (High-Level)

### Company Flow
- Visit landing page -> Sign up as Company -> Create company profile
- Post job -> Review applications -> Shortlist or reject
- Start 1-to-1 messaging with shortlisted candidates

### Freelancer Flow
- Visit landing page -> Sign up as Freelancer -> Create freelancer profile
- Browse jobs -> Filter -> Apply with short note
- Track status -> Message company when shortlisted or when conversation starts

## Privacy & Compliance Notes
- Store only necessary PII for identity and communication (name, email, contact details).
- Avoid storing sensitive data beyond certifications and professional history unless required.
- Default data retention: keep inactive accounts and messages for 12 months unless deletion requested.
- Assume initial deployment in a single jurisdiction; revisit compliance needs as regions expand.
## Requirements

### Functional
1. FR1: The system shall allow users to register and authenticate as either Company or Freelancer with clear role separation.
2. FR2: The system shall allow Companies to create and manage a Company profile with organization and contact details.
3. FR3: The system shall allow Freelancers to create and manage a professional profile including skills, certifications, location, availability, and LinkedIn.
4. FR4: The system shall allow Companies to post short-term jobs with role requirements, location, duration, and timing.
5. FR5: The system shall allow Freelancers to browse and filter jobs by role/skill/location/availability.
6. FR6: The system shall allow Freelancers to apply to jobs with a short note and their profile.
7. FR7: The system shall allow Companies to review applications and shortlist or reject candidates.
8. FR8: The system shall provide 1-to-1 messaging between Company and Freelancer for each job application.
9. FR9: The system shall provide basic admin controls to remove users or job posts.
10. FR10: The system shall present clear disclaimers about platform scope and lack of guarantees.

### Non Functional
1. NFR1: The system shall be web-based and responsive, optimized for desktop with functional mobile browser support.
2. NFR2: The system shall prioritize reliability and fast page loads over rich animations or heavy UI.
3. NFR3: The system shall enforce JWT-based authentication and authorization boundaries by role.
4. NFR4: The system shall not process payments, escrow, subscriptions, commissions, or ratings in MVP.
5. NFR5: The system shall avoid implied liability through explicit UX disclaimers and clear role boundaries.
6. NFR6: The system shall support manual operations and moderation workflows without automation dependencies.

## User Interface Design Goals

### Overall UX Vision
A professional, trust-oriented interface that feels like an internal tool: minimal, clear, and focused on getting to a qualified conversation quickly. The UI should reduce perceived risk with explicit role clarity, disclaimers, and a calm, corporate tone—no startup gimmicks.

### Key Interaction Paradigms
- Role-based onboarding (Company vs Freelancer) with clear expectations
- Simple, linear job posting and application flows
- Structured profiles that surface credibility signals (certifications, availability, LinkedIn)
- Shortlist/reject as primary triage actions
- Message-first engagement with a clean, inbox-style UI
- Admin removal controls designed to be unobtrusive but accessible

### Core Screens and Views
- Landing page (trust-oriented explanation + disclaimers)
- Auth + role selection
- Company dashboard
- Job posting flow
- Job detail + applicant list
- Freelancer profile (public + edit)
- Job feed with filters
- Application view
- Messaging inbox + thread
- Basic admin panel (users/jobs)

### Accessibility
WCAG AA

### Branding
Minimal, professional, maritime-appropriate visual language; clean typography, restrained color palette, and high clarity. Avoid bold marketing visuals or playful UI patterns.

### Target Device and Platforms
Web Responsive

## Technical Assumptions

### Repository Structure
Monorepo

### Service Architecture
Monolithic API (NestJS) with a separate Next.js frontend, deployed together or independently as a single MVP system.

### Testing Requirements
Unit + Integration (focus on core flows: auth, profiles, job posting, applications, messaging). Manual smoke testing for UI workflows is acceptable for MVP.

### Additional Technical Assumptions and Requests
- REST API using NestJS with JWT auth
- PostgreSQL as primary datastore
- No payments, escrow, or subscription integrations
- Simple deployment optimized for speed of iteration (no complex infra)

## Data Requirements

### Core Entities
- User (email, password hash, role, status, created_at)
- CompanyProfile (name, description, contact info, location, created_by)
- FreelancerProfile (skills, certifications, location, availability, LinkedIn, summary)
- Job (title, description, requirements, location, duration, timing, status, company_id)
- Application (job_id, freelancer_id, note, status, created_at)
- Message (application_id, sender_id, body, created_at)
- AdminAction (action_type, target_id, reason, created_at, actor_id)

### Relationships
- A User has exactly one role: Company or Freelancer.
- CompanyProfile is owned by a Company user and can post many Jobs.
- FreelancerProfile is owned by a Freelancer user and can submit many Applications.
- An Application links a FreelancerProfile to a Job.
- Messages are scoped to a specific Application.
- AdminAction records removals of users or jobs.

## MVP Validation Plan

### Validation Method
- Run a 30-day pilot with at least one real company and at least one real freelancer.
- Track platform events (job_post_created, application_submitted, message_sent).
- Conduct short follow-up interviews with both sides after first conversation.

### Success Criteria
- At least one real company posts a job.
- At least one qualified freelancer applies.
- At least one on-platform conversation occurs within 30 days.

### Feedback Capture
- Manual outreach after each completed conversation.
- Record friction points in onboarding, posting, applying, and messaging.

## Operational Requirements

### Monitoring and Logging
- Basic application logs for auth, job, application, and messaging flows.
- Error tracking for failed requests and 5xx responses.
- Simple uptime checks with alerting to the team.

### Support and Moderation
- Manual moderation workflow for removing users/jobs.
- Clear internal process for handling reported issues.
## Epic List

Epic 1: Foundation & Access
Goal: Establish project setup, authentication, role separation, and a minimal landing page with trust messaging.

Epic 2: Profiles & Trust Signals
Goal: Enable company and freelancer profile creation to surface credibility and context.

Epic 3: Job Marketplace Core
Goal: Allow companies to post jobs and freelancers to browse, filter, and apply.

Epic 4: Engagement & Messaging
Goal: Enable application triage (shortlist/reject) and 1-to-1 messaging to initiate real conversations.

Epic 5: Admin Safeguards
Goal: Provide basic admin controls to remove users or jobs for safety and compliance.

## Epic 1: Foundation & Access

Epic Goal
Establish the foundational project setup and deliver the first deployable slice: a live landing page that communicates trust and scope, plus authentication and role separation so users can begin onboarding. This epic ensures the MVP has a credible, accessible entry point and secure access control.

Story 1.1: Project setup and deployment baseline
As a platform owner,
I want the project initialized with a deployable baseline,
so that the system can be accessed in a production-like environment from the start.

Acceptance Criteria
1.1.1: Repository initialized with standard project structure and basic documentation.
1.1.2: CI/CD (or equivalent deploy workflow) produces a working deployment target.
1.1.3: A simple “canary” page is accessible in the deployed environment.

Story 1.2: Landing page with trust messaging and scope disclaimers
As a visitor,
I want a clear landing page that explains the platform purpose and limitations,
so that I can understand the value and risk boundaries before signing up.

Acceptance Criteria
1.2.1: Landing page states the platform’s purpose and target users.
1.2.2: Landing page includes explicit disclaimers (no payments, no guarantees).
1.2.3: Landing page provides clear paths for Company and Freelancer sign-up.

Story 1.3: Role-based authentication and access
As a user,
I want to sign up or log in as a Company or Freelancer,
so that I can access features relevant to my role.

Acceptance Criteria
1.3.1: Users can register and log in with role selection (Company or Freelancer).
1.3.2: Auth system enforces role-based access restrictions.
1.3.3: Authenticated users are directed to a role-appropriate starting screen.

## Epic 2: Profiles & Trust Signals

Epic Goal
Enable companies and freelancers to present structured, credible profiles that provide the minimum trust signals needed for a first conversation. This epic builds the professional context required for meaningful job matching.

Story 2.1: Company profile creation
As a Company user,
I want to create and edit a company profile,
so that freelancers can understand who is hiring and the operational context.

Acceptance Criteria
2.1.1: Company can create and edit profile details (name, description, contact info).
2.1.2: Company profile is visible to freelancers on job postings or application views.

Story 2.2: Freelancer profile creation
As a Freelancer user,
I want to create and edit a professional profile,
so that companies can assess my qualifications quickly.

Acceptance Criteria
2.2.1: Freelancer can add skills, certifications, location, availability, and LinkedIn.
2.2.2: Freelancer profile is visible on applications and job browsing views.

## Epic 3: Job Marketplace Core

Epic Goal
Deliver the core marketplace loop: companies create jobs, freelancers discover and apply, and the platform captures the essential supply–demand signal.

Story 3.1: Job posting
As a Company user,
I want to create and manage short-term job posts,
so that I can attract qualified maritime experts.

Acceptance Criteria
3.1.1: Company can create a job post with role requirements, location, duration, and timing.
3.1.2: Company can edit or close a job post.
3.1.3: Job posts are visible to freelancers in the job feed.

Story 3.2: Job browsing and filtering
As a Freelancer user,
I want to browse and filter available jobs,
so that I can find relevant opportunities quickly.

Acceptance Criteria
3.2.1: Freelancer can view a list of open jobs.
3.2.2: Freelancer can filter by role/skill, location, and availability.

Story 3.3: Apply to job
As a Freelancer user,
I want to apply to a job with my profile and a short note,
so that I can express interest and qualification.

Acceptance Criteria
3.3.1: Freelancer can submit an application to a job.
3.3.2: Company can see the application associated with the job.

## Epic 4: Engagement & Messaging

Epic Goal
Enable companies to triage applicants and begin direct conversations, fulfilling the MVP’s success criterion of a real conversation initiated on-platform.

Story 4.1: Application review and shortlist/reject
As a Company user,
I want to review applications and shortlist or reject candidates,
so that I can efficiently narrow to the right expert.

Acceptance Criteria
4.1.1: Company can view all applications for a job.
4.1.2: Company can mark an application as shortlisted or rejected.
4.1.3: Freelancer can see their application status.

Story 4.2: 1-to-1 messaging
As a Company or Freelancer,
I want to send and receive messages related to a job application,
so that we can coordinate and decide on engagement.

Acceptance Criteria
4.2.1: Messaging is available between a Company and Freelancer once an application exists.
4.2.2: Messages are scoped to the job application context.
4.2.3: Users can view message history in a simple thread view.

## Epic 5: Admin Safeguards

Epic Goal
Provide minimal admin controls to remove users or job posts, ensuring platform safety and compliance without adding complexity.

Story 5.1: Basic admin removal controls
As an Admin,
I want to remove users or job posts,
so that I can address safety or compliance issues quickly.

Acceptance Criteria
5.1.1: Admin can remove a user account.
5.1.2: Admin can remove a job post.
5.1.3: Removed users/jobs are no longer visible to other users.

## Checklist Results Report

### Executive Summary
- Overall PRD completeness: ~90%
- MVP scope appropriateness: Just Right
- Readiness for architecture phase: Ready
- Most critical gaps: stakeholder alignment and detailed UX flow/error handling (optional for architecture start)

### Category Analysis Table
| Category                         | Status  | Critical Issues |
| -------------------------------- | ------- | --------------- |
| 1. Problem Definition & Context  | PARTIAL | User research evidence still thin; impact not quantified |
| 2. MVP Scope Definition          | PARTIAL | Out-of-scope rationale not explicitly documented |
| 3. User Experience Requirements  | PARTIAL | Missing error states and IA/navigation detail |
| 4. Functional Requirements       | PARTIAL | No explicit feature priorities or dependencies |
| 5. Non-Functional Requirements   | PARTIAL | Compliance/privacy specifics still light |
| 6. Epic & Story Structure        | PARTIAL | Dependencies not documented; local testability not specified |
| 7. Technical Guidance            | PARTIAL | Limited trade-off rationale and monitoring detail |
| 8. Cross-Functional Requirements | PARTIAL | Integrations remain unspecified |
| 9. Clarity & Communication       | PARTIAL | Stakeholders and approval/comms plan missing |

### Top Issues by Priority
BLOCKERS
- None

HIGH
- Add stakeholder/approval alignment section (even minimal).
- Add feature dependency notes (can be brief).

MEDIUM
- Add error-state expectations for critical flows.
- Clarify compliance/privacy expectations (jurisdictions, retention).

LOW
- Add out-of-scope rationale and competitive/user research sources if available.

### MVP Scope Assessment
- Potential cuts: Admin safeguards could be deferred if timeline pressure emerges.
- Missing essentials: Stakeholder alignment and dependency notes.
- Complexity concerns: Messaging and role-based flows remain core but manageable.
- Timeline realism: Achievable if scope remains lean.

### Technical Readiness
- Constraints and data model are clear enough to proceed.
- Technical risks are noted; privacy requirements should be validated.
- Architecture can begin with current assumptions.

### Recommendations
- Add a brief stakeholder/approval section.
- Add dependencies between epics and key stories.
- Keep privacy retention assumptions visible and revisit as region expands.

### Final Decision
READY FOR ARCHITECT: The PRD is sufficient to start architecture, with minor additions recommended.

## Next Steps

### UX Expert Prompt
Use this PRD to define the UX vision, key screens, and interface patterns for the maritime expert marketplace MVP. Focus on trust, professional tone, and minimal UI that reduces risk perception for corporate users.

### Architect Prompt
Use this PRD to define the system architecture, data model, and API design for the maritime expert marketplace MVP. Maintain a monolithic NestJS API with Next.js frontend, PostgreSQL, JWT auth, and simple deployment. Prioritize reliability and speed-to-iteration.





