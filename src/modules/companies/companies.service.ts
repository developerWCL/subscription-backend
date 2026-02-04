import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Company } from '../../entities/companies.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

import { randomBytes } from 'crypto';
import { CompanyResponseDto } from './dto/company-response.dto';

@Injectable()
export class CompaniesService {
  // Runtime helper to call bcrypt.hash via dynamic import and a typed cast
  private async doHash(s: string, rounds: number) {
    const mod = (await import('bcryptjs')) as {
      hash: (str: string, r: number) => Promise<string>;
    };
    return mod.hash(s, rounds);
  }
  constructor(private dataSource: DataSource) {}

  private repo() {
    return this.dataSource.getRepository(Company);
  }

  private toResponse(company: Company): CompanyResponseDto {
    return {
      id: company.id,
      name: company.name,
      billingEmail: company.billingEmail ?? null,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
      deletedAt: company.deletedAt ?? null,
    } as CompanyResponseDto;
  }

  async create(createDto: CreateCompanyDto) {
    const repo = this.repo();
    const company = new Company();
    company.name = createDto.name;
    company.billingEmail = createDto.billingEmail;

    // Generate a plaintext API key if not provided, but always store the hashed value.
    let plainApiKey: string | undefined = createDto.apiKey;
    if (!plainApiKey) {
      plainApiKey = randomBytes(32).toString('hex');
    }

    if (plainApiKey) {
      company.apiKey = await this.doHash(plainApiKey, 10);
    }

    const saved = await repo.save(company);
    // Return company response without hashed api_key, but include the plaintext API key once.
    return { ...this.toResponse(saved), api_key: plainApiKey };
  }

  async findAll() {
    const companies = await this.repo().find();
    return companies.map((c) => this.toResponse(c));
  }

  async findOne(id: string) {
    const found = await this.repo().findOne({ where: { id } });
    if (!found) throw new NotFoundException('Company not found');
    return this.toResponse(found);
  }

  async update(id: string, updateDto: UpdateCompanyDto) {
    const repo = this.repo();
    const company = await repo.findOne({ where: { id } });
    if (!company) throw new NotFoundException('Company not found');

    if (updateDto.name !== undefined) company.name = updateDto.name;
    if (updateDto.billingEmail !== undefined)
      company.billingEmail = updateDto.billingEmail;
    if (updateDto.apiKey !== undefined) {
      company.apiKey = updateDto.apiKey
        ? await this.doHash(updateDto.apiKey, 10)
        : null;
    }

    const saved = await repo.save(company);
    return this.toResponse(saved);
  }

  async remove(id: string) {
    const repo = this.repo();
    const company = await repo.findOne({ where: { id } });
    if (!company) throw new NotFoundException('Company not found');
    await repo.softRemove(company);
    return { deleted: true };
  }
}
