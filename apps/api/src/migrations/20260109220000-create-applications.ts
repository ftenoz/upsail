import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex
} from "typeorm";

export class CreateApplications20260109220000 implements MigrationInterface {
  name = "CreateApplications20260109220000";

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    await queryRunner.createTable(
      new Table({
        name: "applications",
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
            name: "jobId",
            type: "uuid"
          },
          {
            name: "freelancerId",
            type: "uuid"
          },
          {
            name: "note",
            type: "text",
            isNullable: true
          },
          {
            name: "status",
            type: "varchar",
            default: "'applied'"
          },
          {
            name: "createdAt",
            type: "timestamptz",
            default: "now()"
          }
        ]
      })
    );

    await queryRunner.createForeignKeys("applications", [
      new TableForeignKey({
        columnNames: ["jobId"],
        referencedTableName: "jobs",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE"
      }),
      new TableForeignKey({
        columnNames: ["freelancerId"],
        referencedTableName: "freelancer_profiles",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE"
      })
    ]);

    await queryRunner.createIndices("applications", [
      new TableIndex({
        name: "applications_job_idx",
        columnNames: ["jobId"]
      }),
      new TableIndex({
        name: "applications_freelancer_idx",
        columnNames: ["freelancerId"]
      })
    ]);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("applications");
  }
}
