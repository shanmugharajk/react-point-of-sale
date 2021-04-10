import { MigrationInterface, QueryRunner } from 'typeorm';

export class users1618075285550 implements MigrationInterface {
  name = 'users1618075285550';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" character varying NOT NULL, "userName" character varying NOT NULL, "password" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying NOT NULL, "role" integer NOT NULL DEFAULT '1', "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
