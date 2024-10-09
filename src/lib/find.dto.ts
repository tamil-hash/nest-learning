import { IsOptional, IsString, IsNumber } from 'class-validator';

export class FindAllDto {
  @IsOptional()
  @IsString()
  query?: any;

  @IsOptional()
  @IsString()
  sort?: any;

  @IsOptional()
  @IsString({ each: true })
  only?: string[];

  @IsOptional()
  @IsNumber()
  skip?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsString()
  include?: string;
}
