export class CompanyResponseDto {
  id: string;
  name: string;
  billing_email?: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
}
