import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { UserRole } from "../decorators/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.get<UserRole[]>(
      "roles",
      context.getHandler()
    );
    if (!required || required.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user?: { role?: UserRole } }>();
    const role = request.user?.role;
    if (!role || !required.includes(role)) {
      throw new ForbiddenException("Insufficient role permissions.");
    }

    return true;
  }
}
