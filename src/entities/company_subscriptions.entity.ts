import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import { Company } from './companies.entity';
import { ServicesCatalog } from './services_catalog.entity';
import { SubscriptionPlan } from './subscription_plans.entity';

@Entity('company_subscriptions')
export class CompanySubscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Company, (c) => c.subscriptions, { onDelete: 'CASCADE' })
  company: Company;

  @ManyToOne(() => ServicesCatalog, (s) => s.subscriptions, {
    onDelete: 'CASCADE',
  })
  service: ServicesCatalog;

  @ManyToOne(() => SubscriptionPlan, (p) => p.subscriptions, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  plan?: SubscriptionPlan;

  @Column({ default: 'active' })
  status: string;

  @Column({ type: 'timestamp', nullable: true })
  start_date?: Date;

  @Column({ type: 'timestamp', nullable: true })
  end_date?: Date;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at?: Date;
}
