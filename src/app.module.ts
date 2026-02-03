import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { typeOrmConfig } from './config/typeorm';
import { ServicesCatalogModule } from './modules/services-catalog/services-catalog.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    SubscriptionsModule,
    CompaniesModule,
    ServicesCatalogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
