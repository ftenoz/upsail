import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex
} from "typeorm";

export class CreateJobs20260109210000 implements MigrationInterface {
  name = "CreateJobs20260109210000";

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    await queryRunner.createTable(
      new Table({
        name: "jobs",
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
            name: "companyId",
            type: "uuid"
          },
          {
            name: "title",
            type: "varchar"
          },
          {
            name: "description",
            type: "text"
          },
          {
            name: "requirements",
            type: "text",
            isArray: true,
            default: "'{}'"
          },
          {
            name: "location",
            type: "varchar",
            isNullable: true
          },
          {
            name: "duration",
            type: "varchar",
            isNullable: true
          },
          {
            name: "timing",
            type: "varchar",
            isNullable: true
          },
          {
            name: "status",
            type: "varchar",
            default: "'open'"
          }
        ]
      })
    );

    await queryRunner.createForeignKey(
      "jobs",
      new TableForeignKey({
        columnNames: ["companyId"],
        referencedTableName: "company_profiles",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE"
      })
    );

    await queryRunner.createIndices("jobs", [
      new TableIndex({
        name: "jobs_status_idx",
        columnNames: ["status"]
      }),
      new TableIndex({
        name: "jobs_location_idx",
        columnNames: ["location"]
      })
    ]);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("jobs");
  }
}
