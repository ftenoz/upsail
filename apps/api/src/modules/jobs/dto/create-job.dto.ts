import { ArrayNotEmpty, IsArray, IsString, MaxLength } from "class-validator";

export class CreateJobDto {
  @IsString()
  @MaxLength(120)
  title!: string;

  @IsString()
  @MaxLength(2000)
  description!: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  requirements!: string[];

  @IsString()
  @MaxLength(120)
  location!: string;

  @IsString()
  @MaxLength(120)
  duration!: string;

  @IsString()
  @MaxLength(120)
  timing!: string;
}
