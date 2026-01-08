import type { FreelancerProfile } from "@upsail/shared";
import { requestJson } from "./api";

export type FreelancerProfilePayload = {
  skills?: string[];
  certifications?: string[];
  location?: string;
  availability?: string;
  linkedInUrl?: string;
};

export type FreelancerProfileResponse = {
  profile: FreelancerProfile | null;
};

export const getFreelancerProfile = () => {
  return requestJson<FreelancerProfileResponse>("/freelancer/profile");
};

export const createFreelancerProfile = (payload: FreelancerProfilePayload) => {
  return requestJson<FreelancerProfile>("/freelancer/profile", {
    method: "POST",
    body: JSON.stringify(payload)
  });
};

export const updateFreelancerProfile = (payload: FreelancerProfilePayload) => {
  return requestJson<FreelancerProfile>("/freelancer/profile", {
    method: "PUT",
    body: JSON.stringify(payload)
  });
};

export const getPublicFreelancerProfile = (freelancerId: string) => {
  return requestJson<FreelancerProfile>(`/freelancer/${freelancerId}`);
};
