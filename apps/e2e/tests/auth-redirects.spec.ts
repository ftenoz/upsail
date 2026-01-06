import { test, expect } from "@playwright/test";

const createEmail = (role: string) =>
  `${role}-${Date.now()}@example.com`;

const password = "Password123!";

test.describe("auth redirects", () => {
  test("redirects company users after register and login", async ({ page }) => {
    const email = createEmail("company");

    await page.goto("/register");
    await page.fill("#email", email);
    await page.fill("#password", password);
    await page.check('input[name="role"][value="company"]');
    await page.getByRole("button", { name: "Create account" }).click();
    await page.waitForURL("**/company/dashboard");
    await expect(page.getByRole("heading", { name: "Company dashboard" })).toBeVisible();

    await page.goto("/login");
    await page.fill("#login-email", email);
    await page.fill("#login-password", password);
    await page.check('input[name="role"][value="company"]');
    await page.getByRole("button", { name: "Log in" }).click();
    await page.waitForURL("**/company/dashboard");
  });

  test("redirects freelancer users after register and login", async ({ page }) => {
    const email = createEmail("freelancer");

    await page.goto("/register");
    await page.fill("#email", email);
    await page.fill("#password", password);
    await page.check('input[name="role"][value="freelancer"]');
    await page.getByRole("button", { name: "Create account" }).click();
    await page.waitForURL("**/freelancer/jobs");
    await expect(page.getByRole("heading", { name: "Freelancer jobs" })).toBeVisible();

    await page.goto("/login");
    await page.fill("#login-email", email);
    await page.fill("#login-password", password);
    await page.check('input[name="role"][value="freelancer"]');
    await page.getByRole("button", { name: "Log in" }).click();
    await page.waitForURL("**/freelancer/jobs");
  });
});
