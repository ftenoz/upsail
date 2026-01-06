import {
  BadRequestException,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { Repository } from "typeorm";
import type { RegisterDto } from "./dto/register.dto";
import type { LoginDto } from "./dto/login.dto";
import { User } from "./user.entity";

type AuthResponse = {
  token: string;
  role: "company" | "freelancer";
};

const getJwtSecret = () => process.env.JWT_SECRET ?? "dev-secret";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const existingUser = await this.users.findOne({
      where: { email: dto.email }
    });
    if (existingUser) {
      throw new BadRequestException("Email already registered.");
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = this.users.create({
      email: dto.email,
      passwordHash,
      role: dto.role,
      name: null,
      companyName: null
    });
    const savedUser = await this.users.save(user);

    return {
      token: this.signToken(savedUser),
      role: savedUser.role
    };
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.users.findOne({
      where: { email: dto.email }
    });
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

  private signToken(user: User) {
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
