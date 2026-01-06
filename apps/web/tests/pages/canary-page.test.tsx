import { render, screen } from "@testing-library/react";
import LandingPage from "../../src/app/(public)/page";

describe("Landing page", () => {
  it("renders purpose, disclaimers, and sign-up CTAs", () => {
    render(<LandingPage />);

    expect(
      screen.getByText("Trusted maritime experts, matched with companies")
    ).toBeInTheDocument();
    expect(screen.getByText(/no payments/i)).toBeInTheDocument();
    expect(screen.getByText(/no guarantees/i)).toBeInTheDocument();

    const companyCta = screen.getByRole("link", { name: "Company sign-up" });
    const freelancerCta = screen.getByRole("link", {
      name: "Freelancer sign-up"
    });

    expect(companyCta).toHaveAttribute("href", "/register");
    expect(freelancerCta).toHaveAttribute("href", "/register");
  });
});
