# Testing Strategy

## Testing Pyramid
```text
E2E Tests
/        \
Integration Tests
/            \
Frontend Unit  Backend Unit
```

## Test Organization

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

## Test Examples

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
