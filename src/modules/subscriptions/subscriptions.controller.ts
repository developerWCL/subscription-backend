import {
  Controller,
  Post,
  Body,
  Headers,
  Get,
  Param,
  Query,
  Patch,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private svc: SubscriptionsService) {}

  // POST /subscriptions/validate-key
  @Post('validate-key')
  async validateKey(
    @Headers('x-api-key') apiKeyHeader: string,
    @Headers('x-service-token') serviceTokenHeader: string,
    @Body() body: { service?: string; apiKey?: string },
  ) {
    const serviceToken = serviceTokenHeader;
    if (!(await this.svc.validateServiceToken(serviceToken))) {
      return { valid: false, reason: 'Invalid service token' };
    }
    const apiKey = apiKeyHeader || body.apiKey || '';
    const service = body?.service;
    return this.svc.validateApiKey(apiKey, service);
  }

  // POST /subscriptions
  @Post()
  async create(@Body() body: CreateSubscriptionDto) {
    try {
      const payload: CreateSubscriptionDto = body;
      return this.svc.createSubscription(payload);
    } catch (err: any) {
      throw new HttpException(
        err.message || 'Create failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // GET /subscriptions
  @Get()
  async list(
    @Query('companyId') companyId?: string,
    @Query('serviceId') serviceId?: string,
  ) {
    return this.svc.listSubscriptions({ companyId, serviceId });
  }

  // GET /subscriptions/:id
  @Get(':id')
  async get(@Param('id') id: string) {
    const res = await this.svc.getSubscription(id);
    if (!res) throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    return res;
  }

  // PATCH /subscriptions/:id
  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateSubscriptionDto) {
    try {
      return this.svc.updateSubscription(id, body);
    } catch (err: any) {
      throw new HttpException(
        err.message || 'Update failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // DELETE /subscriptions/:id
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.svc.deleteSubscription(id);
  }

  // ---- Subscription Plans CRUD ----
  // POST /subscriptions/plans
  @Post('plans')
  async createPlan(@Body() body: CreatePlanDto) {
    try {
      return this.svc.createPlan(body);
    } catch (err: any) {
      throw new HttpException(
        err.message || 'Create plan failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // GET /subscriptions/plans
  @Get('plans')
  async listPlans(@Query('serviceId') serviceId?: string) {
    return this.svc.listPlans({ serviceId });
  }

  // GET /subscriptions/plans/:id
  @Get('plans/:id')
  async getPlan(@Param('id') id: string) {
    const res = await this.svc.getPlan(id);
    if (!res) throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    return res;
  }

  // PATCH /subscriptions/plans/:id
  @Patch('plans/:id')
  async updatePlan(@Param('id') id: string, @Body() body: UpdatePlanDto) {
    try {
      return this.svc.updatePlan(id, body);
    } catch (err: any) {
      throw new HttpException(
        err.message || 'Update plan failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // DELETE /subscriptions/plans/:id
  @Delete('plans/:id')
  async deletePlan(@Param('id') id: string) {
    return this.svc.deletePlan(id);
  }
}
