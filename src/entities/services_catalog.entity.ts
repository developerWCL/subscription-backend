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
  @Column({ name: 'service_token', type: 'text', nullable: true })
  serviceToken: string | null;

  @Column({ name: 'api_url', type: 'text', nullable: true })
  apiUrl: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;

  @OneToMany(() => SubscriptionPlan, (p) => p.service)
  plans: SubscriptionPlan[];

  @OneToMany(() => CompanySubscription, (cs) => cs.service)
  subscriptions: CompanySubscription[];
}
