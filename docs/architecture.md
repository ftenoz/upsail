# Maritime Expert Marketplace MVP Fullstack Architecture Document

## Introduction

This document outlines the complete fullstack architecture for the Maritime Expert Marketplace MVP, including backend systems, frontend implementation, and their integration. It serves as the single source of truth for AI-driven development, ensuring consistency across the entire technology stack.

This unified approach combines what would traditionally be separate backend and frontend architecture documents, streamlining the development process for modern fullstack applications where these concerns are increasingly intertwined.

### Starter Template or Existing Project
N/A - Greenfield project. The PRD specifies a monorepo with Next.js + NestJS and PostgreSQL, but no starter template or existing codebase is referenced.

### Change Log
| Date | Version | Description | Author |
| --- | --- | --- | --- |
| 2026-01-04 | v0.1 | Initial fullstack architecture draft from PRD | Winston (Architect) |

## High Level Architecture

### Technical Summary
A monolithic NestJS REST API paired with a Next.js web frontend delivers the MVP with clear role separation and secure JWT-based access. The system deploys as a single fullstack monorepo to optimize speed of iteration and maintain shared types between frontend and backend. Core flows - profiles, jobs, applications, and messaging - are served via a REST API backed by PostgreSQL. The platform targets a professional, trust-oriented web experience with fast page loads and restrained UI. This architecture aligns to the PRD goals of rapid validation and minimal operational complexity.

### Platform and Infrastructure Choice
Option A: **Heroku (Apps + Heroku Postgres)**
Pros: Simple fullstack deployment, managed Postgres, minimal ops overhead.
Cons: No built-in edge CDN; cost can rise with scale.

Option B: **Render (Web + Managed Postgres)**
Pros: Simple deployment and reasonable pricing.
Cons: Less mature ecosystem than Heroku.

Option C: **AWS (ECS/Fargate + RDS + CloudFront)**
Pros: Enterprise-grade scalability and control.
Cons: Overkill for MVP; higher ops cost and complexity.

**Recommendation:** Option A (Heroku) to minimize operational overhead for MVP.

**Platform:** Heroku
**Key Services:** Heroku app hosting (web + api), Heroku Postgres, basic logs/metrics
**Deployment Host and Regions:** Single region (default to US-East unless user specifies)

### Repository Structure
**Structure:** Monorepo
**Monorepo Tool:** npm workspaces
**Package Organization:** `apps/web` (Next.js), `apps/api` (NestJS), `packages/shared` (types/utilities)

### High Level Architecture Diagram
```mermaid
graph TD
  User[User Browser] -->|HTTPS| Web[Next.js Frontend]
  Web -->|REST| API[NestJS API]
  API --> DB[(PostgreSQL)]
  API --> Logs[Logging/Monitoring]
  Web --> CDN[Static Assets]
```

### Architectural Patterns
- **Monolithic Fullstack:** Single backend service with clear modules - _Rationale:_ Minimizes complexity and accelerates MVP delivery.
- **Component-Based UI:** React components in Next.js - _Rationale:_ Maintainable, reusable UI with clear separation of concerns.
- **REST API with JWT:** Standardized endpoints and role-scoped access - _Rationale:_ Simple, interoperable, aligns to PRD.
- **Repository Pattern (Data Access):** Encapsulated DB access - _Rationale:_ Improves testability and enables future DB flexibility.
- **Shared Types Package:** Shared TypeScript models - _Rationale:_ Prevents schema drift between frontend and backend.

## Tech Stack

### Technology Stack Table
| Category | Technology | Version | Purpose | Rationale |
| --- | --- | --- | --- | --- |
| Frontend Language | TypeScript | 5.x | Typed UI development | Prevents frontend/backend drift; shared types |
| Frontend Framework | Next.js | 14.x | Web UI and routing | PRD specifies Next.js; fast SSR/CSR |
| UI Component Library | Radix UI + Tailwind CSS | latest | Accessible components + styling | Professional, minimal, fast to build |
| State Management | TanStack Query | 5.x | Server state/data fetching | Reduces boilerplate; reliable caching |
| Backend Language | TypeScript | 5.x | Typed API development | Aligns with NestJS + shared types |
| Backend Framework | NestJS | 10.x | REST API | PRD specifies NestJS; structured modules |
| API Style | REST | OpenAPI 3.0 | API contracts | PRD specifies REST; standard tooling |
| Database | PostgreSQL | 16.x | Primary datastore | PRD specifies Postgres; relational fit |
| Cache | None (MVP) | N/A | Keep ops minimal | MVP scope; add Redis later if needed |
| File Storage | None (MVP) | N/A | No file uploads in PRD | Avoids extra infra |
| Authentication | JWT + bcrypt | N/A | Auth and role separation | PRD requires JWT |
| Frontend Testing | Vitest + RTL | latest | UI unit tests | Fast and modern for Next.js |
| Backend Testing | Jest + Supertest | latest | API testing | Common NestJS testing stack |
| E2E Testing | Playwright | latest | End-to-end coverage | Reliable cross-browser tests |
| Build Tool | npm workspaces | N/A | Monorepo orchestration | Lightweight monorepo choice |
| Bundler | Next.js built-in | N/A | Frontend bundling | Default, lowest friction |
| IaC Tool | None (MVP) | N/A | Keep infra simple | MVP speed over infra |
| CI/CD | GitHub Actions | latest | Build/test/deploy | Standard and quick to set up |
| Monitoring | Sentry | latest | Error tracking | Captures frontend/backend errors |
| Logging | Pino + platform logs | latest | App logs | Lightweight structured logging |
| CSS Framework | Tailwind CSS | 3.x | UI styling | Fast, consistent, minimal design |

## Data Models

### User
**Purpose:** Account identity and role boundary for Company vs Freelancer.

**Key Attributes:**
- id: string (uuid) - primary identifier
- email: string - login credential
- passwordHash: string - stored auth secret
- role: "company" | "freelancer" | "admin" - access control
- status: "active" | "disabled" - admin moderation
- createdAt: string (ISO date) - audit

**TypeScript Interface**
```typescript
export interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: "company" | "freelancer" | "admin";
  status: "active" | "disabled";
  createdAt: string;
}
```

**Relationships**
- User 1:1 CompanyProfile (if role=company)
- User 1:1 FreelancerProfile (if role=freelancer)
- User 1:M AdminAction (if role=admin)

### CompanyProfile
**Purpose:** Structured company identity and contact context.

**Key Attributes:**
- id: string (uuid) - primary identifier
- userId: string - owning user
- name: string - company name
- description: string - company summary
- contactEmail: string - primary contact
- location: string - headquarters/operating region

**TypeScript Interface**
```typescript
export interface CompanyProfile {
  id: string;
  userId: string;
  name: string;
  description: string;
  contactEmail: string;
  location: string;
}
```

**Relationships**
- CompanyProfile 1:1 User
- CompanyProfile 1:M Job

### FreelancerProfile
**Purpose:** Professional profile with trust signals.

**Key Attributes:**
- id: string (uuid) - primary identifier
- userId: string - owning user
- skills: string[] - role/skill tags
- certifications: string[] - maritime credentials
- location: string - operating region
- availability: string - short availability note
- linkedInUrl?: string - optional link

**TypeScript Interface**
```typescript
export interface FreelancerProfile {
  id: string;
  userId: string;
  skills: string[];
  certifications: string[];
  location: string;
  availability: string;
  linkedInUrl?: string;
}
```

**Relationships**
- FreelancerProfile 1:1 User
- FreelancerProfile 1:M Application

### Job
**Purpose:** Company job posting for short-term engagement.

**Key Attributes:**
- id: string (uuid) - primary identifier
- companyId: string - owning company profile
- title: string - role title
- description: string - job summary
- requirements: string[] - key requirements
- location: string - job location
- duration: string - time window
- timing: string - start/end timing
- status: "open" | "closed" - lifecycle

**TypeScript Interface**
```typescript
export interface Job {
  id: string;
  companyId: string;
  title: string;
  description: string;
  requirements: string[];
  location: string;
  duration: string;
  timing: string;
  status: "open" | "closed";
}
```

**Relationships**
- Job M:1 CompanyProfile
- Job 1:M Application

### Application
**Purpose:** Freelancer application to a job with status.

**Key Attributes:**
- id: string (uuid) - primary identifier
- jobId: string - related job
- freelancerId: string - related freelancer profile
- note: string - applicant note
- status: "applied" | "shortlisted" | "rejected"
- createdAt: string (ISO date) - audit

**TypeScript Interface**
```typescript
export interface Application {
  id: string;
  jobId: string;
  freelancerId: string;
  note: string;
  status: "applied" | "shortlisted" | "rejected";
  createdAt: string;
}
```

**Relationships**
- Application M:1 Job
- Application M:1 FreelancerProfile
- Application 1:M Message

### Message
**Purpose:** Job-scoped conversation between company and freelancer.

**Key Attributes:**
- id: string (uuid) - primary identifier
- applicationId: string - conversation context
- senderId: string - user id
- body: string - message text
- createdAt: string (ISO date) - audit

**TypeScript Interface**
```typescript
export interface Message {
  id: string;
  applicationId: string;
  senderId: string;
  body: string;
  createdAt: string;
}
```

**Relationships**
- Message M:1 Application
- Message M:1 User

### AdminAction
**Purpose:** Moderation audit trail for user/job removals.

**Key Attributes:**
- id: string (uuid) - primary identifier
- actionType: "remove_user" | "remove_job"
- targetId: string - userId or jobId
- reason: string - admin note
- actorId: string - admin user
- createdAt: string (ISO date) - audit

**TypeScript Interface**
```typescript
export interface AdminAction {
  id: string;
  actionType: "remove_user" | "remove_job";
  targetId: string;
  reason: string;
  actorId: string;
  createdAt: string;
}
```

**Relationships**
- AdminAction M:1 User (admin actor)

## API Specification

```yaml
openapi: 3.0.0
info:
  title: Maritime Expert Marketplace API
  version: 0.1.0
  description: REST API for authentication, profiles, jobs, applications, messaging, and admin moderation.
servers:
  - url: https://api.example.com
    description: Production (placeholder)

paths:
  /auth/register:
    post:
      summary: Register user with role
  /auth/login:
    post:
      summary: Login and receive JWT

  /company/profile:
    get:
      summary: Get own company profile
    post:
      summary: Create company profile
    put:
      summary: Update company profile

  /freelancer/profile:
    get:
      summary: Get own freelancer profile
    post:
      summary: Create freelancer profile
    put:
      summary: Update freelancer profile

  /jobs:
    get:
      summary: List jobs with filters
    post:
      summary: Create job (company only)
  /jobs/{jobId}:
    get:
      summary: Get job detail
    put:
      summary: Update job
    delete:
      summary: Close job

  /applications:
    post:
      summary: Apply to job (freelancer)
  /jobs/{jobId}/applications:
    get:
      summary: List applications for job (company)
  /applications/{applicationId}:
    get:
      summary: Get application
    patch:
      summary: Update application status (shortlist/reject)

  /applications/{applicationId}/messages:
    get:
      summary: List messages in thread
    post:
      summary: Send message in thread

  /admin/users/{userId}:
    delete:
      summary: Remove user (admin)
  /admin/jobs/{jobId}:
    delete:
      summary: Remove job (admin)

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
  schemas:
    User: { $ref: "#/components/schemas/User" }
    CompanyProfile: { $ref: "#/components/schemas/CompanyProfile" }
    FreelancerProfile: { $ref: "#/components/schemas/FreelancerProfile" }
    Job: { $ref: "#/components/schemas/Job" }
    Application: { $ref: "#/components/schemas/Application" }
    Message: { $ref: "#/components/schemas/Message" }
  responses:
    Unauthorized:
      description: Missing or invalid JWT
security:
  - bearerAuth: []
```

## Components

### Web App (Next.js)
**Responsibility:** User-facing UI for onboarding, profiles, jobs, applications, and messaging.
**Key Interfaces:**
- `/` landing, `/auth` login/register
- `/company/*`, `/freelancer/*` role-based dashboards
**Dependencies:** API service layer, shared types
**Technology Stack:** Next.js 14, React, Tailwind, Radix UI

### API Service (NestJS)
**Responsibility:** Core business logic and REST endpoints for all domain flows.
**Key Interfaces:**
- `/auth/*`, `/company/profile`, `/freelancer/profile`, `/jobs`, `/applications`, `/messages`
**Dependencies:** PostgreSQL, Auth/JWT, shared types
**Technology Stack:** NestJS 10, TypeScript

### Database (PostgreSQL)
**Responsibility:** Persistent storage for users, profiles, jobs, applications, messages, admin actions.
**Key Interfaces:**
- SQL schema with relational constraints
**Dependencies:** NestJS data layer
**Technology Stack:** PostgreSQL 16

### Shared Types Package
**Responsibility:** Shared TypeScript interfaces and DTOs between web and API.
**Key Interfaces:**
- `User`, `CompanyProfile`, `FreelancerProfile`, `Job`, `Application`, `Message`
**Dependencies:** Apps import via workspace package
**Technology Stack:** TypeScript, npm workspaces

### Auth Module
**Responsibility:** JWT-based auth and role-based guards.
**Key Interfaces:**
- JWT issuance, role guards, auth middleware
**Dependencies:** Users table, bcrypt
**Technology Stack:** NestJS Auth module

### Component Diagram
```mermaid
graph LR
  Web[Next.js Web App] --> Api[NestJS API]
  Api --> DB[(PostgreSQL)]
  Web --> Shared[Shared Types]
  Api --> Shared
  Api --> Logs[Logging/Monitoring]
```

## External APIs
None. The MVP does not require external integrations.

## Core Workflows

```mermaid
sequenceDiagram
  participant U as User
  participant Web as Next.js Web
  participant API as NestJS API
  participant DB as PostgreSQL

  %% Auth
  U->>Web: Register/Login
  Web->>API: POST /auth/register or /auth/login
  API->>DB: Create/find user
  DB-->>API: User record
  API-->>Web: JWT
  Web-->>U: Authenticated session

  %% Job posting
  U->>Web: Create Job
  Web->>API: POST /jobs (JWT)
  API->>DB: Insert Job
  DB-->>API: Job created
  API-->>Web: Job response

  %% Browse/apply
  U->>Web: Browse jobs
  Web->>API: GET /jobs?filters
  API->>DB: Query jobs
  DB-->>API: Job list
  API-->>Web: Job list
  U->>Web: Apply to job
  Web->>API: POST /applications (JWT)
  API->>DB: Insert Application
  DB-->>API: Application created
  API-->>Web: Application response

  %% Shortlist + message
  U->>Web: Shortlist applicant
  Web->>API: PATCH /applications/{id}
  API->>DB: Update status
  DB-->>API: Status updated
  API-->>Web: Updated application
  U->>Web: Send message
  Web->>API: POST /applications/{id}/messages
  API->>DB: Insert Message
  DB-->>API: Message saved
  API-->>Web: Message response

  %% Error handling
  alt Invalid JWT or role
    API-->>Web: 401/403 error
    Web-->>U: Show role/permission error
  else Validation error
    API-->>Web: 400 error
    Web-->>U: Show field-level errors
  end
```

## Database Schema

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

## Frontend Architecture

### Component Architecture

**Component Organization**
```text
apps/web/src/
  app/                 # Next.js App Router
    (public)/
    (auth)/
    (company)/
    (freelancer)/
    (admin)/
  components/
    ui/                # Shared UI primitives
    layout/
    forms/
    cards/
  features/
    auth/
    company/
    freelancer/
    jobs/
    applications/
    messaging/
  services/
  hooks/
  styles/
```

**Component Template**
```typescript
type Props = {
  title: string;
};

export function SectionHeader({ title }: Props) {
  return (
    <header className="border-b border-slate-200 pb-2">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
    </header>
  );
}
```

### State Management Architecture

**State Structure**
```typescript
export type SessionState = {
  userId: string;
  role: "company" | "freelancer" | "admin";
  token: string;
};
```

**State Management Patterns**
- Server data via TanStack Query (jobs, applications, profiles)
- Minimal client state in React context (auth/session)
- Mutations invalidate relevant queries (e.g., apply -> jobs/applications)

### Routing Architecture

**Route Organization**
```text
app/
  (public)/page.tsx
  (auth)/login/page.tsx
  (auth)/register/page.tsx
  (company)/dashboard/page.tsx
  (company)/jobs/[jobId]/page.tsx
  (freelancer)/jobs/page.tsx
  (freelancer)/applications/page.tsx
  (messaging)/applications/[id]/page.tsx
  (admin)/users/page.tsx
```

**Protected Route Pattern**
```typescript
import { redirect } from "next/navigation";
import { getSession } from "@/features/auth/session";

export async function requireRole(role: "company" | "freelancer" | "admin") {
  const session = await getSession();
  if (!session || session.role !== role) {
    redirect("/login");
  }
  return session;
}
```

### Frontend Services Layer

**API Client Setup**
```typescript
import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("jwt") : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

**Service Example**
```typescript
import { api } from "@/services/api";
import type { Job } from "@shared/types";

export async function listJobs(params?: { location?: string; skill?: string }) {
  const res = await api.get<Job[]>("/jobs", { params });
  return res.data;
}
```

## Backend Architecture

### Service Architecture

**Controller/Route Organization**
```text
apps/api/src/
  modules/
    auth/
      auth.controller.ts
      auth.service.ts
      auth.module.ts
    users/
      users.controller.ts
      users.service.ts
      users.module.ts
    company/
      company.controller.ts
      company.service.ts
      company.module.ts
    freelancer/
      freelancer.controller.ts
      freelancer.service.ts
      freelancer.module.ts
    jobs/
      jobs.controller.ts
      jobs.service.ts
      jobs.module.ts
    applications/
      applications.controller.ts
      applications.service.ts
      applications.module.ts
    messages/
      messages.controller.ts
      messages.service.ts
      messages.module.ts
    admin/
      admin.controller.ts
      admin.service.ts
      admin.module.ts
  common/
    guards/
    decorators/
    filters/
```

**Controller Template**
```typescript
@Controller("jobs")
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  list(@Query() query: ListJobsDto) {
    return this.jobsService.list(query);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("company")
  create(@Body() dto: CreateJobDto, @Req() req: Request) {
    return this.jobsService.create(req.user.id, dto);
  }
}
```

### Database Architecture

**Schema Design**
```sql
-- See Database Schema section above
```

**Data Access Layer**
```typescript
@Injectable()
export class JobsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async list(filters: ListJobsDto) {
    return this.prisma.job.findMany({
      where: { status: "open" },
    });
  }
}
```

### Authentication and Authorization

**Auth Flow**
```mermaid
sequenceDiagram
  participant U as User
  participant API as NestJS API
  participant DB as PostgreSQL

  U->>API: POST /auth/login
  API->>DB: Find user by email
  DB-->>API: User record
  API->>API: Verify password + role
  API-->>U: JWT token
```

**Middleware/Guards**
```typescript
@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {}

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const required = this.reflector.get<string[]>("roles", context.getHandler()) || [];
    return required.length === 0 || required.includes(req.user.role);
  }
}
```

## Unified Project Structure

```plaintext
upsail2/
  .github/
    workflows/
      ci.yaml
      deploy.yaml
  apps/
    web/
      src/
        app/
        components/
        features/
        services/
        hooks/
        styles/
      public/
      tests/
      package.json
    api/
      src/
        modules/
        common/
      tests/
      package.json
  packages/
    shared/
      src/
        types/
        constants/
        utils/
      package.json
  scripts/
  docs/
    prd.md
    architecture.md
  .env.example
  package.json
  package-lock.json
```

## Development Workflow

### Local Development Setup

**Prerequisites**
```bash
node -v   # >= 20.x
npm -v    # >= 10.x
```

**Initial Setup**
```bash
npm install
```

**Development Commands**
```bash
# Start all services
npm run dev

# Start frontend only
npm run dev:web

# Start backend only
npm run dev:api

# Run tests
npm run test
```

### Environment Configuration

**Required Environment Variables**
```bash
# Frontend (.env.local)
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000

# Backend (.env)
DATABASE_URL=postgresql://user:pass@localhost:5432/upsail
JWT_SECRET=changeme

# Shared
NODE_ENV=development
```

## Deployment Architecture

### Deployment Strategy
**Frontend Deployment:**
- **Platform:** Heroku (web app)
- **Build Command:** `npm run build:web`
- **Start Command:** `npm run start:web`
- **Output Directory:** `.next`
- **CDN/Edge:** Heroku default (no edge CDN); optional later via Cloudflare

**Backend Deployment:**
- **Platform:** Heroku (api app)
- **Build Command:** `npm run build:api`
- **Start Command:** `npm run start:api`
- **Health Check:** `GET /health`
- **Deployment Method:** Long-running Node service

**Database:**
- **Platform:** Heroku Postgres
- **Migrations:** `npm run migrate:deploy` (tool TBD)

### CI/CD Pipeline
```yaml
name: CI
on:
  push:
    branches: [main]
jobs:
  build-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install
      - run: npm run test
      - run: npm run build
```

### Environments
| Environment | Frontend URL | Backend URL | Purpose |
| --- | --- | --- | --- |
| Development | http://localhost:3000 | http://localhost:4000 | Local development |
| Staging | https://staging-<app>.herokuapp.com | https://staging-<api>.herokuapp.com | Pre-production testing |
| Production | https://<app>.herokuapp.com | https://<api>.herokuapp.com | Live environment |

## Security and Performance

### Security Requirements
**Frontend Security:**
- CSP Headers: `default-src 'self'; img-src 'self' data:; connect-src 'self' https://api.<app>.herokuapp.com`
- XSS Prevention: React default escaping + avoid `dangerouslySetInnerHTML`
- Secure Storage: JWT in httpOnly cookie (preferred) or in-memory

**Backend Security:**
- Input Validation: DTO validation with `class-validator` in NestJS
- Rate Limiting: Basic rate limit on auth + messaging endpoints
- CORS Policy: Restrict to web app origins (production + staging)

**Authentication Security:**
- Token Storage: httpOnly cookies (preferred)
- Session Management: Short-lived access tokens with refresh flow (optional for MVP)
- Password Policy: Minimum 8 chars + bcrypt hash

### Performance Optimization
**Frontend Performance:**
- Bundle Size Target: < 300KB initial JS
- Loading Strategy: SSR for core pages; lazy-load messaging and admin areas
- Caching Strategy: HTTP caching for public pages; React Query caching for API data

**Backend Performance:**
- Response Time Target: p95 < 300ms for core endpoints
- Database Optimization: Indexes on jobs status/location, applications by job/freelancer
- Caching Strategy: None for MVP; add Redis if bottlenecks appear

## Testing Strategy

### Testing Pyramid
```text
E2E Tests
/        \
Integration Tests
/            \
Frontend Unit  Backend Unit
```

### Test Organization

**Frontend Tests**
```text
apps/web/tests/
  components/
  pages/
  features/
```

**Backend Tests**
```text
apps/api/tests/
  modules/
  integration/
```

**E2E Tests**
```text
apps/e2e/
  auth/
  jobs/
  applications/
  messaging/
```

### Test Examples

**Frontend Component Test**
```typescript
import { render, screen } from "@testing-library/react";
import { SectionHeader } from "@/components/SectionHeader";

test("renders section title", () => {
  render(<SectionHeader title="Jobs" />);
  expect(screen.getByText("Jobs")).toBeInTheDocument();
});
```

**Backend API Test**
```typescript
import request from "supertest";
import { app } from "../test-app";

test("GET /jobs returns list", async () => {
  const res = await request(app.getHttpServer()).get("/jobs");
  expect(res.status).toBe(200);
});
```

**E2E Test**
```typescript
import { test, expect } from "@playwright/test";

test("company can post a job", async ({ page }) => {
  await page.goto("/login");
  await page.fill("input[name=email]", "company@example.com");
  await page.fill("input[name=password]", "password");
  await page.click("button[type=submit]");
  await page.goto("/company/jobs/new");
  await page.fill("input[name=title]", "Chief Engineer");
  await page.click("button[type=submit]");
  await expect(page.getByText("Job posted")).toBeVisible();
});
```

## Coding Standards

### Critical Fullstack Rules
- **Shared Types Only:** Define domain types in `packages/shared` and import from there - no duplicate interfaces.
- **Service Layer Only:** Frontend must call backend via services in `apps/web/src/services`; no direct `fetch` in components.
- **DTO Validation:** All API inputs validated with NestJS DTOs + `class-validator`.
- **Error Handling:** All API routes must use the standard error filter and return a consistent error shape.
- **Role Guards:** Every protected endpoint must declare required roles.

### Naming Conventions
| Element | Frontend | Backend | Example |
| --- | --- | --- | --- |
| Components | PascalCase | - | `UserProfile.tsx` |
| Hooks | camelCase with 'use' | - | `useAuth.ts` |
| API Routes | - | kebab-case | `/api/job-application` |
| Database Tables | - | snake_case | `freelancer_profiles` |

## Error Handling Strategy

### Error Flow
```mermaid
sequenceDiagram
  participant Web as Next.js Web
  participant API as NestJS API
  participant DB as PostgreSQL

  Web->>API: Request
  API->>DB: Query/Command
  DB-->>API: Result or Error
  alt Validation error
    API-->>Web: 400 + ApiError
  else Unauthorized
    API-->>Web: 401 + ApiError
  else Not Found
    API-->>Web: 404 + ApiError
  else Server Error
    API-->>Web: 500 + ApiError
  end
```

### Error Response Format
```typescript
interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
    timestamp: string;
    requestId: string;
  };
}
```

### Frontend Error Handling
```typescript
export function normalizeApiError(err: unknown): ApiError {
  if (typeof err === "object" && err && "error" in err) {
    return err as ApiError;
  }
  return {
    error: {
      code: "UNKNOWN",
      message: "An unexpected error occurred.",
      timestamp: new Date().toISOString(),
      requestId: "unknown",
    },
  };
}
```

### Backend Error Handling
```typescript
@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const status = exception instanceof HttpException ? exception.getStatus() : 500;

    res.status(status).json({
      error: {
        code: exception instanceof HttpException ? exception.name : "INTERNAL_ERROR",
        message: exception instanceof HttpException ? exception.message : "Internal server error",
        details: exception instanceof HttpException ? exception.getResponse() : undefined,
        timestamp: new Date().toISOString(),
        requestId: req.headers["x-request-id"] || "unknown",
      },
    });
  }
}
```

## Monitoring and Observability

### Monitoring Stack
- **Frontend Monitoring:** Sentry (Next.js browser + server)
- **Backend Monitoring:** Sentry (NestJS)
- **Error Tracking:** Sentry
- **Performance Monitoring:** Sentry Performance + basic Heroku metrics

### Key Metrics
**Frontend Metrics:**
- Core Web Vitals
- JavaScript errors
- API response times
- User interactions

**Backend Metrics:**
- Request rate
- Error rate
- Response time
- Database query performance

## Checklist Results Report
Checklist not run yet. The user opted to skip output and run the checklist later.
