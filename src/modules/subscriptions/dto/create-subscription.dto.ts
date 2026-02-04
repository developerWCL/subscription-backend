import { IsOptional, IsString, IsDateString } from 'class-validator';
import { Expose } from 'class-transformer';

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
  @Expose({ name: 'start_date' })
  startDate?: string | Date | null;

  @IsOptional()
  @IsDateString()
  @Expose({ name: 'end_date' })
  endDate?: string | Date | null;
}
