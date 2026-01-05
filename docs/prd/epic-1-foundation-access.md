# Epic 1: Foundation & Access

Epic Goal
Establish the foundational project setup and deliver the first deployable slice: a live landing page that communicates trust and scope, plus authentication and role separation so users can begin onboarding. This epic ensures the MVP has a credible, accessible entry point and secure access control.

Story 1.1: Project setup and deployment baseline
As a platform owner,
I want the project initialized with a deployable baseline,
so that the system can be accessed in a production-like environment from the start.

Acceptance Criteria
1.1.1: Repository initialized with standard project structure and basic documentation.
1.1.2: CI/CD (or equivalent deploy workflow) produces a working deployment target.
1.1.3: A simple �canary� page is accessible in the deployed environment.

Story 1.2: Landing page with trust messaging and scope disclaimers
As a visitor,
I want a clear landing page that explains the platform purpose and limitations,
so that I can understand the value and risk boundaries before signing up.

Acceptance Criteria
1.2.1: Landing page states the platform�s purpose and target users.
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
