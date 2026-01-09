import type { Job, JobStatus } from "@upsail/shared";
import { requestJson } from "./api";

export type JobPayload = {
  title: string;
  description: string;
  requirements: string[];
  location: string;
  duration: string;
  timing: string;
};

export type JobUpdatePayload = Partial<JobPayload>;

export type ListJobsParams = {
  mine?: boolean;
  status?: JobStatus;
  skill?: string;
  location?: string;
  availability?: string;
};

const buildQuery = (params?: ListJobsParams) => {
  if (!params) return "";
  const search = new URLSearchParams();
  if (params.mine) {
    search.set("mine", "true");
  }
  if (params.status) {
    search.set("status", params.status);
  }
  if (params.skill) {
    search.set("skill", params.skill);
  }
  if (params.location) {
    search.set("location", params.location);
  }
  if (params.availability) {
    search.set("availability", params.availability);
  }
  const query = search.toString();
  return query ? `?${query}` : "";
};

export const listJobs = (params?: ListJobsParams) => {
  return requestJson<Job[]>(`/jobs${buildQuery(params)}`);
};

export const getJob = (jobId: string) => {
  return requestJson<Job>(`/jobs/${encodeURIComponent(jobId)}`);
};

export const createJob = (payload: JobPayload) => {
  return requestJson<Job>("/jobs", {
    method: "POST",
    body: JSON.stringify(payload)
  });
};

export const updateJob = (jobId: string, payload: JobUpdatePayload) => {
  return requestJson<Job>(`/jobs/${encodeURIComponent(jobId)}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
};

export const closeJob = (jobId: string) => {
  return requestJson<Job>(`/jobs/${encodeURIComponent(jobId)}`, {
    method: "DELETE"
  });
};
