import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { SubscriptionPlan } from './subscription_plans.entity';
import { CompanySubscription } from './company_subscriptions.entity';

@Entity('services_catalog')
export class ServicesCatalog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'text', nullable: true })
  service_token: string | null;

  @Column({ type: 'text', nullable: true })
  api_url: string | null;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at?: Date;

  @OneToMany(() => SubscriptionPlan, (p) => p.service)
  plans: SubscriptionPlan[];

  @OneToMany(() => CompanySubscription, (cs) => cs.service)
  subscriptions: CompanySubscription[];
}
