import { IsOptional, IsString, IsDateString } from 'class-validator';

export class CreateSubscriptionDto {
  @IsString()
  companyId: string;

  @IsString()
  serviceId: string;

  @IsOptional()
  @IsString()
  planId?: string | null;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsDateString()
  start_date?: string | Date | null;

  @IsOptional()
  @IsDateString()
  end_date?: string | Date | null;
}
