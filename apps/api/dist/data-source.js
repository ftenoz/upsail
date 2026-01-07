"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const isProduction = process.env.NODE_ENV === "production";
const databaseUrl = process.env.DATABASE_URL ??
    "postgres://postgres:postgres@localhost:5432/upsail2";
const AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    url: databaseUrl,
    ssl: isProduction ? { rejectUnauthorized: false } : false,
    entities: [__dirname + "/**/*.entity{.ts,.js}"],
    migrations: [__dirname + "/migrations/*{.ts,.js}"],
    synchronize: false
});
exports.default = AppDataSource;
