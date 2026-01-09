import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CompanyProfile } from "../company/company-profile.entity";
import { FreelancerProfile } from "../freelancer/freelancer-profile.entity";
import { Job } from "../jobs/job.entity";
import { Application } from "./application.entity";
import { ApplicationsController } from "./applications.controller";
import { ApplicationsService } from "./applications.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Application,
      Job,
      FreelancerProfile,
      CompanyProfile
    ])
  ],
  controllers: [ApplicationsController],
  providers: [ApplicationsService]
})
export class ApplicationsModule {}
