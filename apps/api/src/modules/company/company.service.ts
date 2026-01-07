import {
  BadRequestException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import type { Repository } from "typeorm";
import { CompanyProfile } from "./company-profile.entity";
import type { CreateCompanyProfileDto } from "./dto/create-company-profile.dto";
import type { UpdateCompanyProfileDto } from "./dto/update-company-profile.dto";

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(CompanyProfile)
    private readonly companyProfiles: Repository<CompanyProfile>
  ) {}

  async getProfileForUser(userId: string): Promise<CompanyProfile | null> {
    return this.companyProfiles.findOne({ where: { userId } });
  }

  async createProfile(
    userId: string,
    dto: CreateCompanyProfileDto
  ): Promise<CompanyProfile> {
    const existing = await this.companyProfiles.findOne({ where: { userId } });
    if (existing) {
      throw new BadRequestException("Company profile already exists.");
    }

    const profile = this.companyProfiles.create({
      userId,
      name: dto.name,
      description: dto.description ?? null,
      contactEmail: dto.contactEmail,
      location: dto.location ?? null
    });
    return this.companyProfiles.save(profile);
  }

  async updateProfile(
    userId: string,
    dto: UpdateCompanyProfileDto
  ): Promise<CompanyProfile> {
    const profile = await this.companyProfiles.findOne({ where: { userId } });
    if (!profile) {
      throw new NotFoundException("Company profile not found.");
    }

    const updated = this.companyProfiles.merge(profile, {
      name: dto.name ?? profile.name,
      description: dto.description ?? profile.description,
      contactEmail: dto.contactEmail ?? profile.contactEmail,
      location: dto.location ?? profile.location
    });
    return this.companyProfiles.save(updated);
  }

  async getPublicProfile(companyId: string): Promise<CompanyProfile> {
    const profile = await this.companyProfiles.findOne({
      where: { userId: companyId }
    });
    if (!profile) {
      throw new NotFoundException("Company profile not found.");
    }

    return profile;
  }
}
