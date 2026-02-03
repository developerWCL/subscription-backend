import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSubscriptionEntities1770085251762 implements MigrationInterface {
  name = 'CreateSubscriptionEntities1770085251762';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "companies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "billing_email" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_d4bc3e82a314fa9e29f652c2c22" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "company_subscriptions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" character varying NOT NULL DEFAULT 'active', "start_date" TIMESTAMP, "end_date" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "companyId" uuid, "serviceId" uuid, "planId" uuid, CONSTRAINT "PK_2dad37af4a389c2878c9b67a050" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "services_catalog" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_0e2c635b902e99ca14bcae49c94" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "subscription_plans" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "price_monthly" numeric(10,2) NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "serviceId" uuid, CONSTRAINT "PK_9ab8fe6918451ab3d0a4fb6bb0c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_subscriptions" ADD CONSTRAINT "FK_cae9d2297645c98f23978e1e9c1" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_subscriptions" ADD CONSTRAINT "FK_fc213562a069c996d9aa3587aea" FOREIGN KEY ("serviceId") REFERENCES "services_catalog"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_subscriptions" ADD CONSTRAINT "FK_59f9ad2eeec93dbe15d3694317f" FOREIGN KEY ("planId") REFERENCES "subscription_plans"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscription_plans" ADD CONSTRAINT "FK_e672918c303d05d92c10accc99c" FOREIGN KEY ("serviceId") REFERENCES "services_catalog"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "subscription_plans" DROP CONSTRAINT "FK_e672918c303d05d92c10accc99c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_subscriptions" DROP CONSTRAINT "FK_59f9ad2eeec93dbe15d3694317f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_subscriptions" DROP CONSTRAINT "FK_fc213562a069c996d9aa3587aea"`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_subscriptions" DROP CONSTRAINT "FK_cae9d2297645c98f23978e1e9c1"`,
    );
    await queryRunner.query(`DROP TABLE "subscription_plans"`);
    await queryRunner.query(`DROP TABLE "services_catalog"`);
    await queryRunner.query(`DROP TABLE "company_subscriptions"`);
    await queryRunner.query(`DROP TABLE "companies"`);
  }
}
