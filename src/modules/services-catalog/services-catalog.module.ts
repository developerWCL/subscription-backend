import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesCatalog } from '../../entities/services_catalog.entity';
import { ServicesCatalogService } from './services-catalog.service';
import { ServicesCatalogController } from './services-catalog.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ServicesCatalog])],
  providers: [ServicesCatalogService],
  controllers: [ServicesCatalogController],
  exports: [ServicesCatalogService],
})
export class ServicesCatalogModule {}
