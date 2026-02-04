import { IsString, IsOptional, IsEmail, IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @Expose({ name: 'api_key' })
  @IsOptional()
  @IsString()
  apiKey?: string;

  @Expose({ name: 'billing_email' })
  @IsOptional()
  @IsEmail()
  billingEmail?: string;
}
