import { IsEmail, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateCompanyProfileDto {
  @IsString()
  @MaxLength(120)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsEmail()
  contactEmail!: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  location?: string;
}
