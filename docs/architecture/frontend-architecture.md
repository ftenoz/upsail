# Frontend Architecture

## Component Architecture

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

## State Management Architecture

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

## Routing Architecture

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

## Frontend Services Layer

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
