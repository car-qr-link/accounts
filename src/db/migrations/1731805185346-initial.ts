import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1731805185346 implements MigrationInterface {
  name = 'Initial1731805185346';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`accounts\` (\`name\` varchar(128) NULL, \`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`phone\` varchar(15) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_41704a57004fc60242d7996bd8\` (\`phone\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`contacts\` (\`channel\` varchar(16) NOT NULL, \`address\` varchar(64) NOT NULL, \`_id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`accountId\` bigint UNSIGNED NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_f85d8c387733ebe8d2dc3a6256\` (\`accountId\`, \`channel\`, \`address\`), PRIMARY KEY (\`_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`qrs\` (\`licensePlate\` varchar(10) NULL, \`_id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`code\` varchar(8) NOT NULL, \`accountId\` bigint UNSIGNED NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_707a2144b01bd5a0385b68ae6d\` (\`code\`), PRIMARY KEY (\`_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`contacts\` ADD CONSTRAINT \`FK_5363bc1655a7339414523a02fd4\` FOREIGN KEY (\`accountId\`) REFERENCES \`accounts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`qrs\` ADD CONSTRAINT \`FK_39a9d3bc533b79a64f039a53a36\` FOREIGN KEY (\`accountId\`) REFERENCES \`accounts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`qrs\` DROP FOREIGN KEY \`FK_39a9d3bc533b79a64f039a53a36\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`contacts\` DROP FOREIGN KEY \`FK_5363bc1655a7339414523a02fd4\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_707a2144b01bd5a0385b68ae6d\` ON \`qrs\``,
    );
    await queryRunner.query(`DROP TABLE \`qrs\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_f85d8c387733ebe8d2dc3a6256\` ON \`contacts\``,
    );
    await queryRunner.query(`DROP TABLE \`contacts\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_41704a57004fc60242d7996bd8\` ON \`accounts\``,
    );
    await queryRunner.query(`DROP TABLE \`accounts\``);
  }
}
