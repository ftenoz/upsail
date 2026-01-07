"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCompanyProfiles20260107120000 = void 0;
const typeorm_1 = require("typeorm");
class CreateCompanyProfiles20260107120000 {
    constructor() {
        this.name = "CreateCompanyProfiles20260107120000";
    }
    async up(queryRunner) {
        await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
        await queryRunner.createTable(new typeorm_1.Table({
            name: "company_profiles",
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
                    name: "userId",
                    type: "uuid",
                    isUnique: true
                },
                {
                    name: "name",
                    type: "varchar"
                },
                {
                    name: "description",
                    type: "text",
                    isNullable: true
                },
                {
                    name: "contactEmail",
                    type: "varchar"
                },
                {
                    name: "location",
                    type: "varchar",
                    isNullable: true
                }
            ]
        }));
        await queryRunner.createForeignKey("company_profiles", new typeorm_1.TableForeignKey({
            columnNames: ["userId"],
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE"
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable("company_profiles");
    }
}
exports.CreateCompanyProfiles20260107120000 = CreateCompanyProfiles20260107120000;
