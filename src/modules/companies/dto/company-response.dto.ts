import { Expose } from 'class-transformer';

export class CompanyResponseDto {
  id: string;
  name: string;

  @Expose({ name: 'billing_email' })
  billingEmail?: string;

  @Expose({ name: 'created_at' })
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  updatedAt: Date;

  @Expose({ name: 'deleted_at' })
  deletedAt?: Date | null;
}
