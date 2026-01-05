# Technical Assumptions

## Repository Structure
Monorepo

## Service Architecture
Monolithic API (NestJS) with a separate Next.js frontend, deployed together or independently as a single MVP system.

## Testing Requirements
Unit + Integration (focus on core flows: auth, profiles, job posting, applications, messaging). Manual smoke testing for UI workflows is acceptable for MVP.

## Additional Technical Assumptions and Requests
- REST API using NestJS with JWT auth
- PostgreSQL as primary datastore
- No payments, escrow, or subscription integrations
- Simple deployment optimized for speed of iteration (no complex infra)
