import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import RegisterPage from "../../src/app/(auth)/register/page";
import LoginPage from "../../src/app/(auth)/login/page";
import { registerUser, loginUser } from "../../src/services/auth";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock })
}));

vi.mock("../../src/services/auth", () => ({
  registerUser: vi.fn(),
  loginUser: vi.fn()
}));

describe("Auth pages", () => {
  beforeEach(() => {
    pushMock.mockClear();
    vi.mocked(registerUser).mockReset();
    vi.mocked(loginUser).mockReset();
  });

  it("registers with a selected role and redirects", async () => {
    vi.mocked(registerUser).mockResolvedValue({
      token: "token",
      role: "company"
    });

    render(<RegisterPage />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "company@example.com" }
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" }
    });
    fireEvent.click(screen.getByLabelText("Company"));

    fireEvent.click(screen.getByRole("button", { name: "Create account" }));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/company/dashboard");
    });
  });

  it("logs in and redirects based on role", async () => {
    vi.mocked(loginUser).mockResolvedValue({
      token: "token",
      role: "freelancer"
    });

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "freelancer@example.com" }
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" }
    });
    fireEvent.click(screen.getByLabelText("Freelancer"));

    fireEvent.click(screen.getByRole("button", { name: "Log in" }));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/freelancer/jobs");
    });
  });
});
