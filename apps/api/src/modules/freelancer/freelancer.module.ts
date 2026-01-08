import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FreelancerController } from "./freelancer.controller";
import { FreelancerProfile } from "./freelancer-profile.entity";
import { FreelancerService } from "./freelancer.service";

@Module({
  imports: [TypeOrmModule.forFeature([FreelancerProfile])],
  controllers: [FreelancerController],
  providers: [FreelancerService]
})
export class FreelancerModule {}
