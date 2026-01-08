import {
  BadRequestException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import type { Repository } from "typeorm";
import { FreelancerProfile } from "./freelancer-profile.entity";
import type { CreateFreelancerProfileDto } from "./dto/create-freelancer-profile.dto";
import type { UpdateFreelancerProfileDto } from "./dto/update-freelancer-profile.dto";

@Injectable()
export class FreelancerService {
  constructor(
    @InjectRepository(FreelancerProfile)
    private readonly freelancerProfiles: Repository<FreelancerProfile>
  ) {}

  async getProfileForUser(userId: string): Promise<FreelancerProfile | null> {
    return this.freelancerProfiles.findOne({ where: { userId } });
  }

  async createProfile(
    userId: string,
    dto: CreateFreelancerProfileDto
  ): Promise<FreelancerProfile> {
    const existing = await this.freelancerProfiles.findOne({ where: { userId } });
    if (existing) {
      throw new BadRequestException("Freelancer profile already exists.");
    }

    const profile = this.freelancerProfiles.create({
      userId,
      skills: dto.skills ?? [],
      certifications: dto.certifications ?? [],
      location: dto.location ?? null,
      availability: dto.availability ?? null,
      linkedInUrl: dto.linkedInUrl ?? null
    });
    return this.freelancerProfiles.save(profile);
  }

  async updateProfile(
    userId: string,
    dto: UpdateFreelancerProfileDto
  ): Promise<FreelancerProfile> {
    const profile = await this.freelancerProfiles.findOne({ where: { userId } });
    if (!profile) {
      throw new NotFoundException("Freelancer profile not found.");
    }

    const updated = this.freelancerProfiles.merge(profile, {
      skills: dto.skills ?? profile.skills,
      certifications: dto.certifications ?? profile.certifications,
      location: dto.location ?? profile.location,
      availability: dto.availability ?? profile.availability,
      linkedInUrl: dto.linkedInUrl ?? profile.linkedInUrl
    });
    return this.freelancerProfiles.save(updated);
  }

  async getPublicProfile(freelancerId: string): Promise<FreelancerProfile> {
    const profile = await this.freelancerProfiles.findOne({
      where: { userId: freelancerId }
    });
    if (!profile) {
      throw new NotFoundException("Freelancer profile not found.");
    }

    return profile;
  }
}
