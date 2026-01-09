import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi } from "vitest";
import CompanyJobApplicationsPage from "../../src/app/company/jobs/[jobId]/page";
import { listJobApplications } from "../../src/services/applications";
import { getJob } from "../../src/services/jobs";

vi.mock("../../src/services/jobs", () => ({
  getJob: vi.fn()
}));

vi.mock("../../src/services/applications", () => ({
  listJobApplications: vi.fn()
}));

const renderWithClient = (ui: React.ReactElement) => {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false }
    }
  });
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
};

describe("Company job applications page", () => {
  beforeEach(() => {
    vi.mocked(getJob).mockReset();
    vi.mocked(listJobApplications).mockReset();
  });

  it("renders applications for a job", async () => {
    vi.mocked(getJob).mockResolvedValue({
      id: "job-1",
      companyId: "company-1",
      title: "Chief engineer",
      description: "Manage vessel operations.",
      requirements: ["Operations"],
      location: "Bergen",
      duration: "6 months",
      timing: "Q3 2026",
      status: "open"
    });
    vi.mocked(listJobApplications).mockResolvedValue([
      {
        id: "application-1",
        jobId: "job-1",
        freelancerId: "freelancer-1",
        note: "Ready to join.",
        status: "applied",
        createdAt: new Date().toISOString()
      }
    ]);

    renderWithClient(
      <CompanyJobApplicationsPage params={{ jobId: "job-1" }} />
    );

    expect(await screen.findByText("Review applicants")).toBeInTheDocument();
    expect(await screen.findByText("Chief engineer")).toBeInTheDocument();
    expect(await screen.findByText("Freelancer freelancer-1")).toBeInTheDocument();
    expect(screen.getByText("Ready to join.")).toBeInTheDocument();
  });

  it("shows an empty state when no applications exist", async () => {
    vi.mocked(getJob).mockResolvedValue({
      id: "job-1",
      companyId: "company-1",
      title: "Chief engineer",
      description: "Manage vessel operations.",
      requirements: ["Operations"],
      location: "Bergen",
      duration: "6 months",
      timing: "Q3 2026",
      status: "open"
    });
    vi.mocked(listJobApplications).mockResolvedValue([]);

    renderWithClient(
      <CompanyJobApplicationsPage params={{ jobId: "job-1" }} />
    );

    expect(await screen.findByText("No applications yet. Check back soon.")).toBeInTheDocument();
  });
});
