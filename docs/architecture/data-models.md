# Data Models

## User
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

## CompanyProfile
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

## FreelancerProfile
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

## Job
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

## Application
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

## Message
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

## AdminAction
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
