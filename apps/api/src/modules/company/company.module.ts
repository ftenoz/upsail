import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CompanyController } from "./company.controller";
import { CompanyProfile } from "./company-profile.entity";
import { CompanyService } from "./company.service";

@Module({
  imports: [TypeOrmModule.forFeature([CompanyProfile])],
  controllers: [CompanyController],
  providers: [CompanyService]
})
export class CompanyModule {}
