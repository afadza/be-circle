import { MigrationInterface, QueryRunner } from "typeorm";

export class MyMigration1698214455462 implements MigrationInterface {
    name = 'MyMigration1698214455462'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "likes" ("id" SERIAL NOT NULL, "created_at" date NOT NULL DEFAULT now(), "updated_at" date NOT NULL DEFAULT now(), "userIdId" integer, "threadIdId" integer, CONSTRAINT "PK_a9323de3f8bced7539a794b4a37" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "threads" ("id" SERIAL NOT NULL, "content" character varying NOT NULL, "image" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "createdByIdId" integer, CONSTRAINT "PK_d8a74804c34fc3900502cd27275" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "full_name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "photo_profile" character varying NOT NULL, "bio" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "replies" ("id" SERIAL NOT NULL, "image" character varying NOT NULL, "content" character varying NOT NULL, "created_at" date NOT NULL DEFAULT now(), "updated_at" date NOT NULL DEFAULT now(), "userIdId" integer, "threadIdId" integer, CONSTRAINT "PK_08f619ebe431e27e9d206bea132" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "likes" ADD CONSTRAINT "FK_314680784cc4ba14bf392fbb873" FOREIGN KEY ("userIdId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "likes" ADD CONSTRAINT "FK_cc28874faae9823b38853f20823" FOREIGN KEY ("threadIdId") REFERENCES "threads"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "threads" ADD CONSTRAINT "FK_9734df8d9b9b93b5eae713ed655" FOREIGN KEY ("createdByIdId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "following" ADD CONSTRAINT "FK_45428a713ee7d51def21b67ff20" FOREIGN KEY ("following_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "following" ADD CONSTRAINT "FK_59f580ba79fe33c121f8c3cc095" FOREIGN KEY ("follower_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "replies" ADD CONSTRAINT "FK_829fabbd5394610739e5bb6746f" FOREIGN KEY ("userIdId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "replies" ADD CONSTRAINT "FK_24ad14188b37dcd8686bf0d3862" FOREIGN KEY ("threadIdId") REFERENCES "threads"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "replies" DROP CONSTRAINT "FK_24ad14188b37dcd8686bf0d3862"`);
        await queryRunner.query(`ALTER TABLE "replies" DROP CONSTRAINT "FK_829fabbd5394610739e5bb6746f"`);
        await queryRunner.query(`ALTER TABLE "following" DROP CONSTRAINT "FK_59f580ba79fe33c121f8c3cc095"`);
        await queryRunner.query(`ALTER TABLE "following" DROP CONSTRAINT "FK_45428a713ee7d51def21b67ff20"`);
        await queryRunner.query(`ALTER TABLE "threads" DROP CONSTRAINT "FK_9734df8d9b9b93b5eae713ed655"`);
        await queryRunner.query(`ALTER TABLE "likes" DROP CONSTRAINT "FK_cc28874faae9823b38853f20823"`);
        await queryRunner.query(`ALTER TABLE "likes" DROP CONSTRAINT "FK_314680784cc4ba14bf392fbb873"`);
        await queryRunner.query(`DROP TABLE "replies"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "threads"`);
        await queryRunner.query(`DROP TABLE "likes"`);
    }

}
