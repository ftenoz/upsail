import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export type UserRole = "company" | "freelancer";

export enum UserStatus {
  Active = "active",
  Pending = "pending",
  Disabled = "disabled"
}

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", unique: true })
  email!: string;

  @Column({ type: "varchar" })
  passwordHash!: string;

  @Column({ type: "enum", enum: ["company", "freelancer"] })
  role!: UserRole;

  @Column({ type: "varchar", nullable: true })
  name!: string | null;

  @Column({ type: "varchar", nullable: true })
  companyName!: string | null;

  @Column({ type: "enum", enum: UserStatus, default: UserStatus.Pending })
  status!: UserStatus;
}
