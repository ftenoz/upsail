import { DataSource } from "typeorm";

const isProduction = process.env.NODE_ENV === "production";
const databaseUrl =
  process.env.DATABASE_URL ??
  "postgres://postgres:postgres@localhost:5432/upsail2";

const AppDataSource = new DataSource({
  type: "postgres",
  url: databaseUrl,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
  entities: [__dirname + "/**/*.entity{.ts,.js}"],
  migrations: [__dirname + "/migrations/*{.ts,.js}"],
  synchronize: false
});

export default AppDataSource;
