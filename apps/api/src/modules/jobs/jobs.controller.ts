import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UnauthorizedException,
  UseGuards
} from "@nestjs/common";
import type { Request } from "express";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CreateJobDto } from "./dto/create-job.dto";
import { ListJobsDto } from "./dto/list-jobs.dto";
import { UpdateJobDto } from "./dto/update-job.dto";
import { JobsService } from "./jobs.service";

type AuthRequest = Request & { user?: { sub?: string; role?: "company" | "freelancer" | "admin" } };

@Controller("jobs")
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async list(@Query() query: ListJobsDto, @Req() req: AuthRequest) {
    return this.jobsService.list(query, req.user);
  }

  @Get(":jobId")
  @UseGuards(JwtAuthGuard)
  async getJob(@Param("jobId") jobId: string) {
    return this.jobsService.get(jobId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("company")
  async create(@Req() req: AuthRequest, @Body() dto: CreateJobDto) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException("Missing auth token.");
    }
    return this.jobsService.create(userId, dto);
  }

  @Put(":jobId")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("company")
  async update(
    @Req() req: AuthRequest,
    @Param("jobId") jobId: string,
    @Body() dto: UpdateJobDto
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException("Missing auth token.");
    }
    return this.jobsService.update(userId, jobId, dto);
  }

  @Delete(":jobId")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("company")
  async close(@Req() req: AuthRequest, @Param("jobId") jobId: string) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException("Missing auth token.");
    }
    return this.jobsService.close(userId, jobId);
  }
}
