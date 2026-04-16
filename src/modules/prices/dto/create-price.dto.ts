import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class CreatePriceDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Min(0)
  priceFrom: number;

  @IsInt()
  @IsOptional()
  priceTo?: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsInt()
  @IsPositive()
  durationDays: number;

  @IsBoolean()
  @IsOptional()
  isPopular?: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  features?: string[];
}
