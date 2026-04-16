import { IsArray, IsEnum, IsOptional, IsString, IsUrl } from 'class-validator';
import { ProjectStatus } from '../../../../prisma/generated/prisma/enums';
import { Transform } from 'class-transformer';

export class CreateProjectDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUrl()
  @IsOptional()
  siteUrl?: string;

  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return JSON.parse(value);
    }
    return value;
  })
  tags?: string[];
}
