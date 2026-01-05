import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import type { Request } from "express";
import jwt from "jsonwebtoken";
import type { UserRole } from "../decorators/roles.decorator";

type AuthPayload = {
  sub: string;
  email: string;
  role: UserRole;
};

type AuthRequest = Request & { user?: AuthPayload };

const getJwtSecret = () => process.env.JWT_SECRET ?? "dev-secret";

const extractToken = (req: Request) => {
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) {
    return header.slice(7);
  }

  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";").map((cookie) => cookie.trim());
  const tokenCookie = cookies.find((cookie) => cookie.startsWith("auth_token="));
  return tokenCookie ? tokenCookie.split("=")[1] : null;
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<AuthRequest>();
    const token = extractToken(req);

    if (!token) {
      throw new UnauthorizedException("Missing auth token.");
    }

    try {
      const payload = jwt.verify(token, getJwtSecret()) as AuthPayload;
      req.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException("Invalid or expired auth token.");
    }
  }
}
