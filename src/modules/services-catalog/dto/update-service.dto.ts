import { IsString, IsOptional } from 'class-validator';
import { Expose } from 'class-transformer';

export class UpdateServiceDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsString()
  @Expose({ name: 'service_token' })
  serviceToken?: string | null;
}
