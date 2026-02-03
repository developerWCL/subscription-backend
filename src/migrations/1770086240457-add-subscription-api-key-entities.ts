import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSubscriptionApiKeyEntities1770086240457 implements MigrationInterface {
    name = 'AddSubscriptionApiKeyEntities1770086240457'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "companies" ADD "api_key" character varying`);
        await queryRunner.query(`ALTER TABLE "companies" ADD CONSTRAINT "UQ_143c7390478a2c2de3ee21bed0d" UNIQUE ("api_key")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "companies" DROP CONSTRAINT "UQ_143c7390478a2c2de3ee21bed0d"`);
        await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "api_key"`);
    }

}
