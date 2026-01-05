import {
  BadRequestException,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import type { RegisterDto } from "./dto/register.dto";
import type { LoginDto } from "./dto/login.dto";

type UserRecord = {
  id: string;
  email: string;
  passwordHash: string;
  role: "company" | "freelancer";
};

type AuthResponse = {
  token: string;
  role: "company" | "freelancer";
};

const getJwtSecret = () => process.env.JWT_SECRET ?? "dev-secret";

@Injectable()
export class AuthService {
  private readonly usersByEmail = new Map<string, UserRecord>();

  async register(dto: RegisterDto): Promise<AuthResponse> {
    if (this.usersByEmail.has(dto.email)) {
      throw new BadRequestException("Email already registered.");
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user: UserRecord = {
      id: randomUUID(),
      email: dto.email,
      passwordHash,
      role: dto.role
    };
    this.usersByEmail.set(dto.email, user);

    return {
      token: this.signToken(user),
      role: user.role
    };
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = this.usersByEmail.get(dto.email);
    if (!user) {
      throw new UnauthorizedException("Invalid credentials.");
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordMatch) {
      throw new UnauthorizedException("Invalid credentials.");
    }

    if (dto.role && dto.role !== user.role) {
      throw new UnauthorizedException("Role does not match this account.");
    }

    return {
      token: this.signToken(user),
      role: user.role
    };
  }

  private signToken(user: UserRecord) {
    return jwt.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role
      },
      getJwtSecret(),
      { expiresIn: "1h" }
    );
  }
}
