import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Type, Expose } from 'class-transformer';

export class CreatePlanDto {
  @IsString()
  serviceId: string;

  @IsString()
  name: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Expose({ name: 'price_monthly' })
  priceMonthly?: number;
}
