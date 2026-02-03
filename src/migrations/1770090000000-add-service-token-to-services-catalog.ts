import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddServiceTokenToServicesCatalog1770090000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'services_catalog',
      new TableColumn({
        name: 'service_token',
        type: 'text',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('services_catalog', 'service_token');
  }
}
