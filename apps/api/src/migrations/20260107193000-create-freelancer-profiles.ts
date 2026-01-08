import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateFreelancerProfiles20260107193000
  implements MigrationInterface
{
  name = "CreateFreelancerProfiles20260107193000";

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    await queryRunner.createTable(
      new Table({
        name: "freelancer_profiles",
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
            name: "skills",
            type: "text",
            isArray: true,
            default: "'{}'"
          },
          {
            name: "certifications",
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
            name: "availability",
            type: "varchar",
            isNullable: true
          },
          {
            name: "linkedInUrl",
            type: "varchar",
            isNullable: true
          }
        ]
      })
    );

    await queryRunner.createForeignKey(
      "freelancer_profiles",
      new TableForeignKey({
        columnNames: ["userId"],
        referencedTableName: "users",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE"
      })
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("freelancer_profiles");
  }
}
