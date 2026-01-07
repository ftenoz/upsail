import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateCompanyProfiles20260107120000 implements MigrationInterface {
  name = "CreateCompanyProfiles20260107120000";

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    await queryRunner.createTable(
      new Table({
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
      })
    );

    await queryRunner.createForeignKey(
      "company_profiles",
      new TableForeignKey({
        columnNames: ["userId"],
        referencedTableName: "users",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE"
      })
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("company_profiles");
  }
}
