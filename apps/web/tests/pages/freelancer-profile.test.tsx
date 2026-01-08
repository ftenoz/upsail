import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import FreelancerProfilePage from "../../src/app/freelancer/profile/page";
import FreelancerPublicProfilePage from "../../src/app/freelancer/[freelancerId]/page";
import {
  createFreelancerProfile,
  getFreelancerProfile,
  getPublicFreelancerProfile,
  updateFreelancerProfile
} from "../../src/services/freelancer";

vi.mock("../../src/services/freelancer", () => ({
  createFreelancerProfile: vi.fn(),
  getFreelancerProfile: vi.fn(),
  getPublicFreelancerProfile: vi.fn(),
  updateFreelancerProfile: vi.fn()
}));

describe("Freelancer profile page", () => {
  beforeEach(() => {
    vi.mocked(getFreelancerProfile).mockReset();
    vi.mocked(createFreelancerProfile).mockReset();
    vi.mocked(updateFreelancerProfile).mockReset();
  });

  it("loads an existing profile and updates it", async () => {
    vi.mocked(getFreelancerProfile).mockResolvedValue({
      profile: {
        id: "profile-1",
        userId: "freelancer-1",
        skills: ["Navigation"],
        certifications: ["STCW"],
        location: "Rotterdam",
        availability: "Available in Q2",
        linkedInUrl: "https://www.linkedin.com/in/freelancer"
      }
    });
    vi.mocked(updateFreelancerProfile).mockResolvedValue({
      id: "profile-1",
      userId: "freelancer-1",
      skills: ["Navigation"],
      certifications: ["STCW"],
      location: "Rotterdam",
      availability: "Available in Q2",
      linkedInUrl: "https://www.linkedin.com/in/freelancer"
    });

    render(<FreelancerProfilePage />);

    expect(await screen.findByDisplayValue("Navigation")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Availability"), {
      target: { value: "Available now" }
    });

    fireEvent.click(screen.getByRole("button", { name: "Update profile" }));

    await waitFor(() => {
      expect(updateFreelancerProfile).toHaveBeenCalledWith({
        skills: ["Navigation"],
        certifications: ["STCW"],
        location: "Rotterdam",
        availability: "Available now",
        linkedInUrl: "https://www.linkedin.com/in/freelancer"
      });
    });
  });

  it("creates a profile when none exists", async () => {
    vi.mocked(getFreelancerProfile).mockResolvedValue({ profile: null });
    vi.mocked(createFreelancerProfile).mockResolvedValue({
      id: "profile-2",
      userId: "freelancer-2",
      skills: ["Inspection"],
      certifications: ["STCW"],
      location: "Oslo",
      availability: "Available in Q3",
      linkedInUrl: null
    });

    render(<FreelancerProfilePage />);

    fireEvent.change(await screen.findByLabelText("Skills (comma separated)"), {
      target: { value: "Inspection" }
    });
    fireEvent.change(screen.getByLabelText("Certifications (comma separated)"), {
      target: { value: "STCW" }
    });

    fireEvent.click(screen.getByRole("button", { name: "Create profile" }));

    await waitFor(() => {
      expect(createFreelancerProfile).toHaveBeenCalledWith({
        skills: ["Inspection"],
        certifications: ["STCW"],
        location: undefined,
        availability: undefined,
        linkedInUrl: undefined
      });
    });
  });
});

describe("Public freelancer profile page", () => {
  beforeEach(() => {
    vi.mocked(getPublicFreelancerProfile).mockReset();
  });

  it("renders public freelancer details", async () => {
    vi.mocked(getPublicFreelancerProfile).mockResolvedValue({
      id: "profile-3",
      userId: "freelancer-3",
      skills: ["Navigation"],
      certifications: ["GMDSS"],
      location: "Oslo",
      availability: "Available now",
      linkedInUrl: "https://www.linkedin.com/in/freelancer"
    });

    render(<FreelancerPublicProfilePage params={{ freelancerId: "freelancer-3" }} />);

    expect(await screen.findByText("Navigation")).toBeInTheDocument();
    expect(screen.getByText("GMDSS")).toBeInTheDocument();
    expect(screen.getByText("Available now")).toBeInTheDocument();
  });
});
