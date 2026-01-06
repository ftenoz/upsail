import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUsers20260106194500 implements MigrationInterface {
  name = "CreateUsers20260106194500";

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    await queryRunner.createTable(
      new Table({
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
      })
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("users");
    await queryRunner.query('DROP TYPE IF EXISTS "users_status_enum"');
    await queryRunner.query('DROP TYPE IF EXISTS "users_role_enum"');
  }
}
