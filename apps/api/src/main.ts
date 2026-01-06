import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const defaultCorsOrigins = [
    "http://localhost:3000",
    "https://upsail-web-591ee107d7d1.herokuapp.com"
  ];
  const corsOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim()).filter(Boolean)
    : defaultCorsOrigins;
  app.enableCors({
    origin: corsOrigins,
    credentials: true
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT ? Number(process.env.PORT) : 3001);
}

void bootstrap();
