import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HealthModule } from "./modules/health/health.module";
import { AuthModule } from "./modules/auth/auth.module";
import { CompanyModule } from "./modules/company/company.module";
import { FreelancerModule } from "./modules/freelancer/freelancer.module";
import { JobsModule } from "./modules/jobs/jobs.module";

const getDatabaseUrl = () =>
  process.env.DATABASE_URL ??
  "postgres://postgres:postgres@localhost:5432/upsail2";

const isProduction = process.env.NODE_ENV === "production";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      url: getDatabaseUrl(),
      autoLoadEntities: true,
      synchronize: !isProduction,
      ssl: isProduction ? { rejectUnauthorized: false } : false
    }),
    HealthModule,
    AuthModule,
    CompanyModule,
    FreelancerModule,
    JobsModule
  ]
})
export class AppModule {}
