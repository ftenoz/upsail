import type { CompanyProfile } from "@upsail/shared";
import { requestJson } from "./api";

export type CompanyProfilePayload = {
  name: string;
  description?: string;
  contactEmail: string;
  location?: string;
};

export type CompanyProfileResponse = {
  profile: CompanyProfile | null;
};

export const getCompanyProfile = () => {
  return requestJson<CompanyProfileResponse>("/company/profile");
};

export const createCompanyProfile = (payload: CompanyProfilePayload) => {
  return requestJson<CompanyProfile>("/company/profile", {
    method: "POST",
    body: JSON.stringify(payload)
  });
};

export const updateCompanyProfile = (payload: CompanyProfilePayload) => {
  return requestJson<CompanyProfile>("/company/profile", {
    method: "PUT",
    body: JSON.stringify(payload)
  });
};

export const getPublicCompanyProfile = (companyId: string) => {
  return requestJson<CompanyProfile>(`/company/${companyId}`);
};
