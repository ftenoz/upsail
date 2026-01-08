# API Specification

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
  /company/{companyId}:
    get:
      summary: Get public company profile

  /freelancer/profile:
    get:
      summary: Get own freelancer profile
    post:
      summary: Create freelancer profile
    put:
      summary: Update freelancer profile
  /freelancer/{freelancerId}:
    get:
      summary: Get public freelancer profile

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
