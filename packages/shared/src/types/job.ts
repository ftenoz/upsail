export type JobStatus = "open" | "closed";

export type Job = {
  id: string;
  companyId: string;
  title: string;
  description: string;
  requirements: string[];
  location: string;
  duration: string;
  timing: string;
  status: JobStatus;
};
