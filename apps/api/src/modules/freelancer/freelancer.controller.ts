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
import { FreelancerService } from "./freelancer.service";
import { CreateFreelancerProfileDto } from "./dto/create-freelancer-profile.dto";
import { UpdateFreelancerProfileDto } from "./dto/update-freelancer-profile.dto";

type AuthRequest = Request & { user?: { sub?: string } };

@Controller("freelancer")
export class FreelancerController {
  constructor(private readonly freelancerService: FreelancerService) {}

  @Get("profile")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("freelancer")
  async getOwnProfile(@Req() req: AuthRequest) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException("Missing auth token.");
    }

    const profile = await this.freelancerService.getProfileForUser(userId);
    return { profile };
  }

  @Post("profile")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("freelancer")
  async createProfile(
    @Req() req: AuthRequest,
    @Body() dto: CreateFreelancerProfileDto
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException("Missing auth token.");
    }

    return this.freelancerService.createProfile(userId, dto);
  }

  @Put("profile")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("freelancer")
  async updateProfile(
    @Req() req: AuthRequest,
    @Body() dto: UpdateFreelancerProfileDto
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException("Missing auth token.");
    }

    return this.freelancerService.updateProfile(userId, dto);
  }

  @Get(":freelancerId")
  async getPublicProfile(@Param("freelancerId") freelancerId: string) {
    return this.freelancerService.getPublicProfile(freelancerId);
  }
}
