# Security and Performance

## Security Requirements
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

## Performance Optimization
**Frontend Performance:**
- Bundle Size Target: < 300KB initial JS
- Loading Strategy: SSR for core pages; lazy-load messaging and admin areas
- Caching Strategy: HTTP caching for public pages; React Query caching for API data

**Backend Performance:**
- Response Time Target: p95 < 300ms for core endpoints
- Database Optimization: Indexes on jobs status/location, applications by job/freelancer
- Caching Strategy: None for MVP; add Redis if bottlenecks appear
