import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export type JobStatus = "open" | "closed";

@Entity({ name: "jobs" })
export class Job {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  companyId!: string;

  @Column({ type: "varchar" })
  title!: string;

  @Column({ type: "text" })
  description!: string;

  @Column({ type: "text", array: true, default: () => "'{}'" })
  requirements!: string[];

  @Column({ type: "varchar", nullable: true })
  location!: string | null;

  @Column({ type: "varchar", nullable: true })
  duration!: string | null;

  @Column({ type: "varchar", nullable: true })
  timing!: string | null;

  @Column({ type: "varchar", default: "open" })
  status!: JobStatus;
}
