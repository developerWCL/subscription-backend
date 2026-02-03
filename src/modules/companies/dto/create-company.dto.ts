import { IsString, IsOptional, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  api_key?: string;

  @IsOptional()
  @IsEmail()
  billing_email?: string;
}
