import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HealthModule } from "./modules/health/health.module";
import { AuthModule } from "./modules/auth/auth.module";

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
      synchronize: true,
      ssl: isProduction ? { rejectUnauthorized: false } : false
    }),
    HealthModule,
    AuthModule
  ]
})
export class AppModule {}
