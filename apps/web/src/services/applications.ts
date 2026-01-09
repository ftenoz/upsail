import type { Application } from "@upsail/shared";
import { requestJson } from "./api";

export type CreateApplicationPayload = {
  jobId: string;
  note?: string;
};

export const createApplication = (payload: CreateApplicationPayload) => {
  return requestJson<Application>("/applications", {
    method: "POST",
    body: JSON.stringify(payload)
  });
};

export const listJobApplications = (jobId: string) => {
  return requestJson<Application[]>(
    `/jobs/${encodeURIComponent(jobId)}/applications`
  );
};
