import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export type ApplicationStatus = "applied" | "shortlisted" | "rejected";

@Entity({ name: "applications" })
export class Application {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  jobId!: string;

  @Column({ type: "uuid" })
  freelancerId!: string;

  @Column({ type: "text", nullable: true })
  note!: string | null;

  @Column({ type: "varchar", default: "applied" })
  status!: ApplicationStatus;

  @Column({ type: "timestamptz", default: () => "now()" })
  createdAt!: Date;
}
