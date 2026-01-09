import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UnauthorizedException,
  UseGuards
} from "@nestjs/common";
import type { Request } from "express";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { ApplicationsService } from "./applications.service";
import { CreateApplicationDto } from "./dto/create-application.dto";

type AuthRequest = Request & { user?: { sub?: string } };

@Controller()
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post("applications")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("freelancer")
  async apply(@Req() req: AuthRequest, @Body() dto: CreateApplicationDto) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException("Missing auth token.");
    }
    return this.applicationsService.apply(userId, dto);
  }

  @Get("jobs/:jobId/applications")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("company")
  async list(@Req() req: AuthRequest, @Param("jobId") jobId: string) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException("Missing auth token.");
    }
    return this.applicationsService.listForJob(userId, jobId);
  }
}
