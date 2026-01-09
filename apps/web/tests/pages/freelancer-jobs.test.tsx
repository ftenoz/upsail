import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi } from "vitest";
import FreelancerJobsPage from "../../src/app/freelancer/jobs/page";
import { listJobs } from "../../src/services/jobs";

vi.mock("../../src/services/jobs", () => ({
  listJobs: vi.fn()
}));

const renderWithClient = (ui: React.ReactElement) => {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false }
    }
  });
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
};

describe("Freelancer jobs page", () => {
  beforeEach(() => {
    vi.mocked(listJobs).mockReset();
  });

  it("renders open jobs from the feed", async () => {
    vi.mocked(listJobs).mockResolvedValue([
      {
        id: "job-1",
        companyId: "company-1",
        title: "Offshore maintenance planner",
        description: "Plan maintenance for offshore assets.",
        requirements: ["Planning"],
        location: "Oslo",
        duration: "3 months",
        timing: "Q2 2026",
        status: "open"
      }
    ]);

    renderWithClient(<FreelancerJobsPage />);

    expect(await screen.findByText("Offshore maintenance planner")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Company profile" })).toHaveAttribute(
      "href",
      "/company/company-1"
    );
  });

  it("shows an empty state when no jobs are available", async () => {
    vi.mocked(listJobs).mockResolvedValue([]);

    renderWithClient(<FreelancerJobsPage />);

    expect(await screen.findByText("No open jobs yet. Check back soon.")).toBeInTheDocument();
  });

  it("applies filters to the jobs feed", async () => {
    vi.mocked(listJobs).mockResolvedValue([]);

    renderWithClient(<FreelancerJobsPage />);

    fireEvent.change(screen.getByLabelText("Role or skill"), {
      target: { value: "Offshore" }
    });
    fireEvent.change(screen.getByLabelText("Location"), {
      target: { value: "Oslo" }
    });
    fireEvent.change(screen.getByLabelText("Availability"), {
      target: { value: "Q2 2026" }
    });

    fireEvent.click(screen.getByRole("button", { name: "Apply filters" }));

    await waitFor(() => {
      expect(listJobs).toHaveBeenLastCalledWith({
        skill: "Offshore",
        location: "Oslo",
        availability: "Q2 2026"
      });
    });
  });
});
