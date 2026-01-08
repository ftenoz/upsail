import { IsArray, IsOptional, IsString, IsUrl, MaxLength } from "class-validator";

export class CreateFreelancerProfileDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  certifications?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(120)
  location?: string;

  @IsOptional()
  @IsString()
  @MaxLength(280)
  availability?: string;

  @IsOptional()
  @IsUrl()
  linkedInUrl?: string;
}
