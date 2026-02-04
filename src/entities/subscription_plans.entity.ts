import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ServicesCatalog } from './services_catalog.entity';
import { CompanySubscription } from './company_subscriptions.entity';

@Entity('subscription_plans')
export class SubscriptionPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ServicesCatalog, (s) => s.plans, { onDelete: 'CASCADE' })
  service: ServicesCatalog;

  @Column()
  name: string;

  @Column({
    name: 'price_monthly',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  priceMonthly: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;

  @OneToMany(() => CompanySubscription, (cs) => cs.plan)
  subscriptions: CompanySubscription[];
}
