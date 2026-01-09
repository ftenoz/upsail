import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CompanyProfile } from "../company/company-profile.entity";
import { Job } from "./job.entity";
import { JobsController } from "./jobs.controller";
import { JobsService } from "./jobs.service";

@Module({
  imports: [TypeOrmModule.forFeature([Job, CompanyProfile])],
  controllers: [JobsController],
  providers: [JobsService]
})
export class JobsModule {}
