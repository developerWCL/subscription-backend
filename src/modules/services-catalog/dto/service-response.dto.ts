import { Expose } from 'class-transformer';

export class ServiceResponseDto {
  id: string;
  name: string;
  description?: string;

  @Expose({ name: 'created_at' })
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  updatedAt: Date;

  @Expose({ name: 'deleted_at' })
  deletedAt?: Date;
}
