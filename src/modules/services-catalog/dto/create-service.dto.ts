import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @Expose({ name: 'service_token' })
  serviceToken?: string;
}
