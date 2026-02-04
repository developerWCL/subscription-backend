import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Company } from '../../entities/companies.entity';
import { CompanySubscription } from '../../entities/company_subscriptions.entity';
import { ServicesCatalog } from '../../entities/services_catalog.entity';
import { SubscriptionPlan } from '../../entities/subscription_plans.entity';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';

@Injectable()
export class SubscriptionsService {
  constructor(private dataSource: DataSource) {}

  async validateServiceToken(token?: string) {
    const repo = this.dataSource.getRepository(ServicesCatalog);
    const services = await repo.find();
    const hashedTokens = services
      .map((s) => s.serviceToken)
      .filter((t): t is string => !!t);

    // If no token is configured in DB, allow by default (no service-token enforcement)
    if (hashedTokens.length === 0) return true;

    if (!token) return false;

    for (const hashed of hashedTokens) {
      const match = await bcrypt.compare(token, hashed);
      if (match) return true;
    }
    return false;
  }

  async validateApiKey(apiKey: string, serviceName?: string) {
    if (!apiKey) return { valid: false };

    const companyRepo = this.dataSource.getRepository(Company);
    // Find companies that have an api_key and compare with hashed values
    const companies = await companyRepo.find({ where: {} });
    let company: Company | undefined;
    for (const c of companies) {
      if (!c.apiKey) continue;
      const match = await bcrypt.compare(apiKey, c.apiKey);
      if (match) {
        company = c;
        break;
      }
    }

    if (!company) return { valid: false };

    const subscriptionRepo = this.dataSource.getRepository(CompanySubscription);

    // If serviceName provided, join through service
    if (serviceName) {
      const cs = await subscriptionRepo
        .createQueryBuilder('cs')
        .leftJoinAndSelect('cs.service', 'service')
        .leftJoinAndSelect('cs.plan', 'plan')
        .where('cs.companyId = :companyId', { companyId: company.id })
        .andWhere('service.name = :serviceName', { serviceName })
        .andWhere("cs.status IN ('active','trialing')")
        .getOne();

      if (!cs) return { valid: false };

      return {
        valid: true,
        companyId: company.id,
        status: cs.status,
        planId: cs.plan?.id,
        startDate: cs.startDate,
        endDate: cs.endDate,
      };
    }

    // Otherwise any active subscription
    const any = await subscriptionRepo.findOne({
      where: { company: { id: company.id }, status: 'active' },
    });
    if (!any) return { valid: false };

    return { valid: true, companyId: company.id };
  }

  // CRUD for CompanySubscription
  async createSubscription(payload: CreateSubscriptionDto) {
    const { companyId, serviceId, planId, status, startDate, endDate } =
      payload;
    const companyRepo = this.dataSource.getRepository(Company);
    const serviceRepo = this.dataSource.getRepository(ServicesCatalog);
    const planRepo = this.dataSource.getRepository(SubscriptionPlan);
    const subRepo = this.dataSource.getRepository(CompanySubscription);

    const company = await companyRepo.findOne({ where: { id: companyId } });
    if (!company) throw new BadRequestException('Company not found');
    const service = await serviceRepo.findOne({ where: { id: serviceId } });
    if (!service) throw new BadRequestException('Service not found');

    const subscription = new CompanySubscription();
    subscription.company = company;
    subscription.service = service;
    if (planId) {
      const plan = await planRepo.findOne({ where: { id: planId } });
      if (!plan) throw new BadRequestException('Plan not found');
      subscription.plan = plan;
    }
    if (status) subscription.status = status;
    if (startDate) subscription.startDate = new Date(startDate);
    if (endDate) subscription.endDate = new Date(endDate);

    const saved = await subRepo.save(subscription);

    return saved;
  }

  async getSubscription(id: string) {
    const subRepo = this.dataSource.getRepository(CompanySubscription);
    return subRepo.findOne({
      where: { id },
      relations: ['company', 'service', 'plan'],
    });
  }

  async listSubscriptions(filter?: { companyId?: string; serviceId?: string }) {
    const subRepo = this.dataSource.getRepository(CompanySubscription);
    const qb = subRepo
      .createQueryBuilder('cs')
      .leftJoinAndSelect('cs.company', 'company')
      .leftJoinAndSelect('cs.service', 'service')
      .leftJoinAndSelect('cs.plan', 'plan');
    if (filter?.companyId)
      qb.andWhere('company.id = :companyId', { companyId: filter.companyId });
    if (filter?.serviceId)
      qb.andWhere('service.id = :serviceId', { serviceId: filter.serviceId });
    return qb.getMany();
  }

  async updateSubscription(id: string, updates: UpdateSubscriptionDto) {
    const subRepo = this.dataSource.getRepository(CompanySubscription);
    const existing = await subRepo.findOne({
      where: { id },
      relations: ['company', 'service', 'plan'],
    });
    if (!existing) throw new BadRequestException('Subscription not found');
    Object.assign(existing, updates);
    return subRepo.save(existing);
  }

  async deleteSubscription(id: string) {
    const subRepo = this.dataSource.getRepository(CompanySubscription);
    // soft delete if supported
    await subRepo.softDelete(id);
    return { deleted: true };
  }

  // CRUD for SubscriptionPlan
  async createPlan(payload: { name: string; priceMonthly?: string | number }) {
    const { name, priceMonthly } = payload;
    const planRepo = this.dataSource.getRepository(SubscriptionPlan);
    const plan = new SubscriptionPlan();
    plan.name = name;
    if (priceMonthly !== undefined) plan.priceMonthly = String(priceMonthly);

    return planRepo.save(plan);
  }

  async getPlan(id: string) {
    const planRepo = this.dataSource.getRepository(SubscriptionPlan);
    return planRepo.findOne({ where: { id }, relations: ['service'] });
  }

  async listPlans(filter?: { serviceId?: string }) {
    const planRepo = this.dataSource.getRepository(SubscriptionPlan);
    const qb = planRepo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.service', 'service');
    if (filter?.serviceId)
      qb.andWhere('service.id = :serviceId', { serviceId: filter.serviceId });
    return qb.getMany();
  }

  async updatePlan(id: string, updates: UpdatePlanDto) {
    const planRepo = this.dataSource.getRepository(SubscriptionPlan);
    const existing = await planRepo.findOne({
      where: { id },
      relations: ['service'],
    });
    if (!existing) throw new BadRequestException('Plan not found');
    Object.assign(existing, updates);
    return planRepo.save(existing);
  }

  async deletePlan(id: string) {
    const planRepo = this.dataSource.getRepository(SubscriptionPlan);
    await planRepo.softDelete(id);
    return { deleted: true };
  }
}
