import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import CompanyProfilePage from "../../src/app/company/profile/page";
import CompanyPublicProfilePage from "../../src/app/company/[companyId]/page";
import {
  createCompanyProfile,
  getCompanyProfile,
  getPublicCompanyProfile,
  updateCompanyProfile
} from "../../src/services/company";

vi.mock("../../src/services/company", () => ({
  createCompanyProfile: vi.fn(),
  getCompanyProfile: vi.fn(),
  getPublicCompanyProfile: vi.fn(),
  updateCompanyProfile: vi.fn()
}));

describe("Company profile page", () => {
  beforeEach(() => {
    vi.mocked(getCompanyProfile).mockReset();
    vi.mocked(createCompanyProfile).mockReset();
    vi.mocked(updateCompanyProfile).mockReset();
  });

  it("loads an existing profile and updates it", async () => {
    vi.mocked(getCompanyProfile).mockResolvedValue({
      profile: {
        id: "profile-1",
        userId: "company-1",
        name: "Dockside Logistics",
        description: "We support port operations worldwide.",
        contactEmail: "ops@dockside.com",
        location: "Rotterdam"
      }
    });
    vi.mocked(updateCompanyProfile).mockResolvedValue({
      id: "profile-1",
      userId: "company-1",
      name: "Dockside Logistics",
      description: "We support port operations worldwide.",
      contactEmail: "ops@dockside.com",
      location: "Rotterdam"
    });

    render(<CompanyProfilePage />);

    expect(await screen.findByDisplayValue("Dockside Logistics")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Location"), {
      target: { value: "Singapore" }
    });

    fireEvent.click(screen.getByRole("button", { name: "Update profile" }));

    await waitFor(() => {
      expect(updateCompanyProfile).toHaveBeenCalledWith({
        name: "Dockside Logistics",
        description: "We support port operations worldwide.",
        contactEmail: "ops@dockside.com",
        location: "Singapore"
      });
    });
  });

  it("creates a profile when none exists", async () => {
    vi.mocked(getCompanyProfile).mockResolvedValue({ profile: null });
    vi.mocked(createCompanyProfile).mockResolvedValue({
      id: "profile-2",
      userId: "company-2",
      name: "Harborline",
      description: null,
      contactEmail: "hello@harborline.com",
      location: null
    });

    render(<CompanyProfilePage />);

    fireEvent.change(await screen.findByLabelText("Company name"), {
      target: { value: "Harborline" }
    });
    fireEvent.change(screen.getByLabelText("Contact email"), {
      target: { value: "hello@harborline.com" }
    });

    fireEvent.click(screen.getByRole("button", { name: "Create profile" }));

    await waitFor(() => {
      expect(createCompanyProfile).toHaveBeenCalledWith({
        name: "Harborline",
        description: undefined,
        contactEmail: "hello@harborline.com",
        location: undefined
      });
    });
  });
});

describe("Public company profile page", () => {
  beforeEach(() => {
    vi.mocked(getPublicCompanyProfile).mockReset();
  });

  it("renders public company details", async () => {
    vi.mocked(getPublicCompanyProfile).mockResolvedValue({
      id: "profile-3",
      userId: "company-3",
      name: "Seaworthy Co.",
      description: "Specialists in offshore maintenance.",
      contactEmail: "contact@seaworthy.co",
      location: "Oslo"
    });

    render(<CompanyPublicProfilePage params={{ companyId: "company-3" }} />);

    expect(await screen.findByText("Seaworthy Co.")).toBeInTheDocument();
    expect(screen.getByText("Specialists in offshore maintenance.")).toBeInTheDocument();
    expect(screen.getByText("contact@seaworthy.co")).toBeInTheDocument();
  });
});
