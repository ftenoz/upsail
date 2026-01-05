import { requestJson } from "./api";

export type AuthRole = "company" | "freelancer";

export type AuthResponse = {
  token: string;
  role: AuthRole;
};

export type RegisterPayload = {
  email: string;
  password: string;
  role: AuthRole;
};

export type LoginPayload = {
  email: string;
  password: string;
  role: AuthRole;
};

export const registerUser = (payload: RegisterPayload) => {
  return requestJson<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload)
  });
};

export const loginUser = (payload: LoginPayload) => {
  return requestJson<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload)
  });
};
