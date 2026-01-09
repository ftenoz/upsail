import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi } from "vitest";
import CompanyJobsPage from "../../src/app/company/jobs/page";
import { closeJob, createJob, listJobs, updateJob } from "../../src/services/jobs";

vi.mock("../../src/services/jobs", () => ({
  closeJob: vi.fn(),
  createJob: vi.fn(),
  listJobs: vi.fn(),
  updateJob: vi.fn()
}));

const renderWithClient = (ui: React.ReactElement) => {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false }
    }
  });
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
};

describe("Company jobs page", () => {
  beforeEach(() => {
    vi.mocked(listJobs).mockReset();
    vi.mocked(createJob).mockReset();
    vi.mocked(updateJob).mockReset();
    vi.mocked(closeJob).mockReset();
  });

  it("creates a new job post", async () => {
    vi.mocked(listJobs).mockResolvedValue([]);
    vi.mocked(createJob).mockResolvedValue({
      id: "job-1",
      companyId: "company-1",
      title: "Deck officer",
      description: "Support deck operations.",
      requirements: ["STCW"],
      location: "Hamburg",
      duration: "2 months",
      timing: "Q3 2026",
      status: "open"
    });

    renderWithClient(<CompanyJobsPage />);

    fireEvent.change(screen.getByLabelText("Job title"), {
      target: { value: "Deck officer" }
    });
    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "Support deck operations." }
    });
    fireEvent.change(screen.getByLabelText("Requirements (comma separated)"), {
      target: { value: "STCW" }
    });
    fireEvent.change(screen.getByLabelText("Location"), {
      target: { value: "Hamburg" }
    });
    fireEvent.change(screen.getByLabelText("Duration"), {
      target: { value: "2 months" }
    });
    fireEvent.change(screen.getByLabelText("Timing"), {
      target: { value: "Q3 2026" }
    });

    fireEvent.click(screen.getByRole("button", { name: "Create job" }));

    await waitFor(() => {
      const [payload] = vi.mocked(createJob).mock.calls[0] ?? [];
      expect(payload).toEqual({
        title: "Deck officer",
        description: "Support deck operations.",
        requirements: ["STCW"],
        location: "Hamburg",
        duration: "2 months",
        timing: "Q3 2026"
      });
    });
  });

  it("updates an existing job post", async () => {
    vi.mocked(listJobs).mockResolvedValue([
      {
        id: "job-1",
        companyId: "company-1",
        title: "Deck officer",
        description: "Support deck operations.",
        requirements: ["STCW"],
        location: "Hamburg",
        duration: "2 months",
        timing: "Q3 2026",
        status: "open"
      }
    ]);
    vi.mocked(updateJob).mockResolvedValue({
      id: "job-1",
      companyId: "company-1",
      title: "Deck officer",
      description: "Updated description.",
      requirements: ["STCW"],
      location: "Hamburg",
      duration: "4 months",
      timing: "Q3 2026",
      status: "open"
    });

    renderWithClient(<CompanyJobsPage />);

    fireEvent.click(await screen.findByRole("button", { name: "Edit" }));

    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "Updated description." }
    });
    fireEvent.change(screen.getByLabelText("Duration"), {
      target: { value: "4 months" }
    });

    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));

    await waitFor(() => {
      expect(updateJob).toHaveBeenCalledWith("job-1", {
        title: "Deck officer",
        description: "Updated description.",
        requirements: ["STCW"],
        location: "Hamburg",
        duration: "4 months",
        timing: "Q3 2026"
      });
    });
  });
});
