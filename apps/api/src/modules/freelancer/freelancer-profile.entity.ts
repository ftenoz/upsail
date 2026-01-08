import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "freelancer_profiles" })
export class FreelancerProfile {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid", unique: true })
  userId!: string;

  @Column({ type: "text", array: true, default: () => "'{}'" })
  skills!: string[];

  @Column({ type: "text", array: true, default: () => "'{}'" })
  certifications!: string[];

  @Column({ type: "varchar", nullable: true })
  location!: string | null;

  @Column({ type: "varchar", nullable: true })
  availability!: string | null;

  @Column({ type: "varchar", nullable: true })
  linkedInUrl!: string | null;
}
