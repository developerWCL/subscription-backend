import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { ServicesCatalog } from '../../entities/services_catalog.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServiceResponseDto } from './dto/service-response.dto';

@Injectable()
export class ServicesCatalogService {
  constructor(private dataSource: DataSource) {}

  private repo() {
    return this.dataSource.getRepository(ServicesCatalog);
  }

  private toResponse(s: ServicesCatalog): ServiceResponseDto {
    // Omit sensitive/relational fields when creating response
    const restObj: Partial<ServicesCatalog> = { ...s };
    delete restObj.serviceToken;
    const r = restObj as unknown as Record<string, unknown>;
    delete r.plans;
    delete r.subscriptions;
    return restObj as ServiceResponseDto;
  }

  async create(dto: CreateServiceDto) {
    const repo = this.repo();
    const s = new ServicesCatalog();
    s.name = dto.name;
    s.description = dto.description;
    // Generate a plaintext token if not provided, hash before storing.
    let plainToken: string | undefined = dto.serviceToken;
    if (!plainToken) plainToken = randomBytes(32).toString('hex');
    if (plainToken) {
      s.serviceToken = await bcrypt.hash(plainToken, 10);
    } else {
      s.serviceToken = null;
    }

    const saved = await repo.save(s);
    // Return the created resource (without hashed token) but include the plaintext token once.
    return { ...this.toResponse(saved), service_token: plainToken };
  }

  async findAll() {
    const all = await this.repo().find();
    return all.map((a) => this.toResponse(a));
  }

  async findOne(id: string) {
    const found = await this.repo().findOne({ where: { id } });
    if (!found) throw new NotFoundException('Service not found');
    return this.toResponse(found);
  }

  async update(id: string, dto: UpdateServiceDto) {
    const repo = this.repo();
    const s = await repo.findOne({ where: { id } });
    if (!s) throw new NotFoundException('Service not found');
    if (dto.name !== undefined) s.name = dto.name;
    if (dto.description !== undefined) s.description = dto.description;
    const providedToken = dto.serviceToken;
    if (dto.serviceToken !== undefined) {
      if (providedToken === null) {
        s.serviceToken = null;
      } else if (providedToken) {
        s.serviceToken = await bcrypt.hash(providedToken, 10);
      } else {
        s.serviceToken = null;
      }
    }
    const saved = await repo.save(s);
    return this.toResponse(saved);
  }

  async remove(id: string) {
    const repo = this.repo();
    const s = await repo.findOne({ where: { id } });
    if (!s) throw new NotFoundException('Service not found');
    await repo.softRemove(s);
    return { deleted: true };
  }
}
