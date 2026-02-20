import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { CompanySubscription } from './company_subscriptions.entity';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ name: 'api_key', nullable: true, unique: true })
  apiKey?: string;

  @Column({ name: 'billing_email', nullable: true })
  billingEmail?: string;

  // pattern:
  // { "primary_color": "#ff0000", "logo_url": "https://example.com/logo.png" , "banner_url": "https://example.com/banner.png"}

  @Column({ name: 'metadata', type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;

  @OneToMany(() => CompanySubscription, (cs) => cs.company)
  subscriptions: CompanySubscription[];
}
