import { render, screen } from "@testing-library/react";
import CanaryPage from "../../src/app/(public)/page";

describe("Canary page", () => {
  it("renders the canary headline", () => {
    render(<CanaryPage />);

    expect(screen.getByText("Canary page is live")).toBeInTheDocument();
  });
});
