export type ApplicationStatus = "applied" | "shortlisted" | "rejected";

export type Application = {
  id: string;
  jobId: string;
  freelancerId: string;
  note: string | null;
  status: ApplicationStatus;
  createdAt: string;
};
