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
  @Column({ name: 'start_date', type: 'timestamp', nullable: true })
  startDate?: Date;

  @Column({ type: 'timestamp', nullable: true })
  @Column({ name: 'end_date', type: 'timestamp', nullable: true })
  endDate?: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;
}
