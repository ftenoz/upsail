# Coding Standards

## Critical Fullstack Rules
- **Shared Types Only:** Define domain types in `packages/shared` and import from there - no duplicate interfaces.
- **Service Layer Only:** Frontend must call backend via services in `apps/web/src/services`; no direct `fetch` in components.
- **DTO Validation:** All API inputs validated with NestJS DTOs + `class-validator`.
- **Error Handling:** All API routes must use the standard error filter and return a consistent error shape.
- **Role Guards:** Every protected endpoint must declare required roles.

## Naming Conventions
| Element | Frontend | Backend | Example |
| --- | --- | --- | --- |
| Components | PascalCase | - | `UserProfile.tsx` |
| Hooks | camelCase with 'use' | - | `useAuth.ts` |
| API Routes | - | kebab-case | `/api/job-application` |
| Database Tables | - | snake_case | `freelancer_profiles` |
