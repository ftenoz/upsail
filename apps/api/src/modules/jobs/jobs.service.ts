import {
  ForbiddenException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import type { Repository } from "typeorm";
import { CompanyProfile } from "../company/company-profile.entity";
import type { UserRole } from "../../common/decorators/roles.decorator";
import type { CreateJobDto } from "./dto/create-job.dto";
import type { ListJobsDto } from "./dto/list-jobs.dto";
import type { UpdateJobDto } from "./dto/update-job.dto";
import { Job } from "./job.entity";

type AuthUser = {
  sub?: string;
  role?: UserRole;
};

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private readonly jobs: Repository<Job>,
    @InjectRepository(CompanyProfile)
    private readonly companyProfiles: Repository<CompanyProfile>
  ) {}

  async list(query: ListJobsDto, user?: AuthUser): Promise<Job[]> {
    if (query.mine) {
      if (user?.role !== "company") {
        throw new ForbiddenException("Company access required.");
      }
      if (!user.sub) {
        throw new NotFoundException("Company profile not found.");
      }
      const companyId = await this.getCompanyIdForUser(user.sub);
      const where = query.status ? { companyId, status: query.status } : { companyId };
      return this.jobs.find({ where });
    }

    const qb = this.jobs.createQueryBuilder("job").where("job.status = :status", {
      status: "open"
    });

    const location = query.location?.trim();
    if (location) {
      qb.andWhere("job.location ILIKE :location", {
        location: `%${location}%`
      });
    }

    const skill = (query.skill ?? query.role)?.trim();
    if (skill) {
      qb.andWhere(":skill = ANY(job.requirements)", { skill });
    }

    const availability = query.availability?.trim();
    if (availability) {
      qb.andWhere("(job.duration ILIKE :availability OR job.timing ILIKE :availability)", {
        availability: `%${availability}%`
      });
    }

    return qb.getMany();
  }

  async get(jobId: string): Promise<Job> {
    const job = await this.jobs.findOne({ where: { id: jobId } });
    if (!job) {
      throw new NotFoundException("Job not found.");
    }
    return job;
  }

  async create(userId: string, dto: CreateJobDto): Promise<Job> {
    const companyId = await this.getCompanyIdForUser(userId);
    const job = this.jobs.create({
      companyId,
      title: dto.title,
      description: dto.description,
      requirements: dto.requirements,
      location: dto.location,
      duration: dto.duration,
      timing: dto.timing,
      status: "open"
    });
    return this.jobs.save(job);
  }

  async update(userId: string, jobId: string, dto: UpdateJobDto): Promise<Job> {
    const companyId = await this.getCompanyIdForUser(userId);
    const job = await this.jobs.findOne({ where: { id: jobId, companyId } });
    if (!job) {
      throw new NotFoundException("Job not found.");
    }

    const updated = this.jobs.merge(job, {
      title: dto.title ?? job.title,
      description: dto.description ?? job.description,
      requirements: dto.requirements ?? job.requirements,
      location: dto.location ?? job.location,
      duration: dto.duration ?? job.duration,
      timing: dto.timing ?? job.timing
    });
    return this.jobs.save(updated);
  }

  async close(userId: string, jobId: string): Promise<Job> {
    const companyId = await this.getCompanyIdForUser(userId);
    const job = await this.jobs.findOne({ where: { id: jobId, companyId } });
    if (!job) {
      throw new NotFoundException("Job not found.");
    }

    job.status = "closed";
    return this.jobs.save(job);
  }

  private async getCompanyIdForUser(userId: string): Promise<string> {
    const profile = await this.companyProfiles.findOne({ where: { userId } });
    if (!profile) {
      throw new NotFoundException("Company profile not found.");
    }
    return profile.id;
  }
}
