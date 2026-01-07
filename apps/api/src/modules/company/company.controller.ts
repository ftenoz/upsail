import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UnauthorizedException,
  UseGuards
} from "@nestjs/common";
import type { Request } from "express";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CompanyService } from "./company.service";
import type { CreateCompanyProfileDto } from "./dto/create-company-profile.dto";
import type { UpdateCompanyProfileDto } from "./dto/update-company-profile.dto";

type AuthRequest = Request & { user?: { sub?: string } };

@Controller("company")
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get("profile")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("company")
  async getOwnProfile(@Req() req: AuthRequest) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException("Missing auth token.");
    }

    const profile = await this.companyService.getProfileForUser(userId);
    return { profile };
  }

  @Post("profile")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("company")
  async createProfile(@Req() req: AuthRequest, @Body() dto: CreateCompanyProfileDto) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException("Missing auth token.");
    }

    return this.companyService.createProfile(userId, dto);
  }

  @Put("profile")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("company")
  async updateProfile(@Req() req: AuthRequest, @Body() dto: UpdateCompanyProfileDto) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException("Missing auth token.");
    }

    return this.companyService.updateProfile(userId, dto);
  }

  @Get(":companyId")
  async getPublicProfile(@Param("companyId") companyId: string) {
    return this.companyService.getPublicProfile(companyId);
  }
}
