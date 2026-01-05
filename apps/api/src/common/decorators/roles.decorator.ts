import { SetMetadata } from "@nestjs/common";

export type UserRole = "company" | "freelancer" | "admin";

export const Roles = (...roles: UserRole[]) => SetMetadata("roles", roles);
