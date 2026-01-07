"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const health_module_1 = require("./modules/health/health.module");
const auth_module_1 = require("./modules/auth/auth.module");
const company_module_1 = require("./modules/company/company.module");
const getDatabaseUrl = () => process.env.DATABASE_URL ??
    "postgres://postgres:postgres@localhost:5432/upsail2";
const isProduction = process.env.NODE_ENV === "production";
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: "postgres",
                url: getDatabaseUrl(),
                autoLoadEntities: true,
                synchronize: !isProduction,
                ssl: isProduction ? { rejectUnauthorized: false } : false
            }),
            health_module_1.HealthModule,
            auth_module_1.AuthModule,
            company_module_1.CompanyModule
        ]
    })
], AppModule);
