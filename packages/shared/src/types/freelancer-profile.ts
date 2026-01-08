export type FreelancerProfile = {
  id: string;
  userId: string;
  skills: string[];
  certifications: string[];
  location: string | null;
  availability: string | null;
  linkedInUrl: string | null;
};
