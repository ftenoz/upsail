import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "company_profiles" })
export class CompanyProfile {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid", unique: true })
  userId!: string;

  @Column({ type: "varchar" })
  name!: string;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  @Column({ type: "varchar" })
  contactEmail!: string;

  @Column({ type: "varchar", nullable: true })
  location!: string | null;
}
