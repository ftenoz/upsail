"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUsers20260106194500 = void 0;
const typeorm_1 = require("typeorm");
class CreateUsers20260106194500 {
    constructor() {
        this.name = "CreateUsers20260106194500";
    }
    async up(queryRunner) {
        await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
        await queryRunner.createTable(new typeorm_1.Table({
            name: "users",
            columns: [
                {
                    name: "id",
                    type: "uuid",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "uuid",
                    default: "uuid_generate_v4()"
                },
                {
                    name: "email",
                    type: "varchar",
                    isUnique: true
                },
                {
                    name: "passwordHash",
                    type: "varchar"
                },
                {
                    name: "role",
                    type: "enum",
                    enum: ["company", "freelancer"],
                    enumName: "users_role_enum"
                },
                {
                    name: "name",
                    type: "varchar",
                    isNullable: true
                },
                {
                    name: "companyName",
                    type: "varchar",
                    isNullable: true
                },
                {
                    name: "status",
                    type: "enum",
                    enum: ["active", "pending", "disabled"],
                    enumName: "users_status_enum",
                    default: "'pending'"
                }
            ]
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable("users");
        await queryRunner.query('DROP TYPE IF EXISTS "users_status_enum"');
        await queryRunner.query('DROP TYPE IF EXISTS "users_role_enum"');
    }
}
exports.CreateUsers20260106194500 = CreateUsers20260106194500;
