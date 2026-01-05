# Tech Stack

## Technology Stack Table
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
