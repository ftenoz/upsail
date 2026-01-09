import {
  BadRequestException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import type { Repository } from "typeorm";
import { CompanyProfile } from "../company/company-profile.entity";
import { FreelancerProfile } from "../freelancer/freelancer-profile.entity";
import { Job } from "../jobs/job.entity";
import { Application } from "./application.entity";
import type { CreateApplicationDto } from "./dto/create-application.dto";

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private readonly applications: Repository<Application>,
    @InjectRepository(Job)
    private readonly jobs: Repository<Job>,
    @InjectRepository(FreelancerProfile)
    private readonly freelancers: Repository<FreelancerProfile>,
    @InjectRepository(CompanyProfile)
    private readonly companies: Repository<CompanyProfile>
  ) {}

  async apply(userId: string, dto: CreateApplicationDto): Promise<Application> {
    const freelancer = await this.freelancers.findOne({ where: { userId } });
    if (!freelancer) {
      throw new NotFoundException("Freelancer profile not found.");
    }

    const job = await this.jobs.findOne({ where: { id: dto.jobId } });
    if (!job) {
      throw new NotFoundException("Job not found.");
    }
    if (job.status !== "open") {
      throw new BadRequestException("Job is closed.");
    }

    const existing = await this.applications.findOne({
      where: { jobId: job.id, freelancerId: freelancer.id }
    });
    if (existing) {
      throw new BadRequestException("Application already submitted.");
    }

    const application = this.applications.create({
      jobId: job.id,
      freelancerId: freelancer.id,
      note: dto.note?.trim() ? dto.note.trim() : null,
      status: "applied"
    });
    return this.applications.save(application);
  }

  async listForJob(userId: string, jobId: string): Promise<Application[]> {
    const company = await this.companies.findOne({ where: { userId } });
    if (!company) {
      throw new NotFoundException("Company profile not found.");
    }

    const job = await this.jobs.findOne({
      where: { id: jobId, companyId: company.id }
    });
    if (!job) {
      throw new NotFoundException("Job not found.");
    }

    return this.applications.find({
      where: { jobId },
      order: { createdAt: "DESC" }
    });
  }
}
