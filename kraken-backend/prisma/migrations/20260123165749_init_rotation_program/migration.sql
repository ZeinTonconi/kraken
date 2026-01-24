/*
  Warnings:

  - A unique constraint covering the columns `[block_id,user_id]` on the table `team_memberships` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[team_id,block_id,user_id]` on the table `team_memberships` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `block_id` to the `team_memberships` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProgramOfferingType" AS ENUM ('PRACTICA_INTERNA', 'INDUCCION');

-- CreateEnum
CREATE TYPE "ProgramBlockType" AS ENUM ('LEADER_BLOCK', 'JUNIOR_ROLE_BLOCK');

-- CreateEnum
CREATE TYPE "LeaderRole" AS ENUM ('QA', 'FRONTEND', 'BACKEND', 'DEVOPS');

-- DropIndex
DROP INDEX "team_memberships_team_id_user_id_key";

-- AlterTable
ALTER TABLE "team_memberships" ADD COLUMN     "block_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "teams" ADD COLUMN     "leader_block_id" UUID,
ADD COLUMN     "program_id" UUID;

-- CreateTable
CREATE TABLE "rotation_programs" (
    "id" UUID NOT NULL,
    "academic_year" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "starts_at" TIMESTAMP(3) NOT NULL,
    "ends_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rotation_programs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "program_offerings" (
    "id" UUID NOT NULL,
    "program_id" UUID NOT NULL,
    "offering_id" UUID NOT NULL,
    "type" "ProgramOfferingType" NOT NULL,

    CONSTRAINT "program_offerings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "program_blocks" (
    "id" UUID NOT NULL,
    "program_id" UUID NOT NULL,
    "type" "ProgramBlockType" NOT NULL,
    "order" INTEGER NOT NULL,
    "starts_at" TIMESTAMP(3) NOT NULL,
    "ends_at" TIMESTAMP(3) NOT NULL,
    "role" "JobRole",

    CONSTRAINT "program_blocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "program_leaders" (
    "id" UUID NOT NULL,
    "program_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "leader_role" "LeaderRole" NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "program_leaders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "rotation_programs_starts_at_ends_at_idx" ON "rotation_programs"("starts_at", "ends_at");

-- CreateIndex
CREATE UNIQUE INDEX "rotation_programs_academic_year_key" ON "rotation_programs"("academic_year");

-- CreateIndex
CREATE INDEX "program_offerings_program_id_type_idx" ON "program_offerings"("program_id", "type");

-- CreateIndex
CREATE UNIQUE INDEX "program_offerings_program_id_offering_id_key" ON "program_offerings"("program_id", "offering_id");

-- CreateIndex
CREATE INDEX "program_blocks_program_id_starts_at_ends_at_idx" ON "program_blocks"("program_id", "starts_at", "ends_at");

-- CreateIndex
CREATE UNIQUE INDEX "program_blocks_program_id_type_order_key" ON "program_blocks"("program_id", "type", "order");

-- CreateIndex
CREATE INDEX "program_leaders_program_id_leader_role_active_idx" ON "program_leaders"("program_id", "leader_role", "active");

-- CreateIndex
CREATE UNIQUE INDEX "program_leaders_program_id_user_id_key" ON "program_leaders"("program_id", "user_id");

-- CreateIndex
CREATE INDEX "team_memberships_block_id_idx" ON "team_memberships"("block_id");

-- CreateIndex
CREATE UNIQUE INDEX "team_memberships_block_id_user_id_key" ON "team_memberships"("block_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "team_memberships_team_id_block_id_user_id_key" ON "team_memberships"("team_id", "block_id", "user_id");

-- CreateIndex
CREATE INDEX "teams_program_id_leader_block_id_idx" ON "teams"("program_id", "leader_block_id");

-- AddForeignKey
ALTER TABLE "program_offerings" ADD CONSTRAINT "program_offerings_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "rotation_programs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "program_offerings" ADD CONSTRAINT "program_offerings_offering_id_fkey" FOREIGN KEY ("offering_id") REFERENCES "course_offerings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "program_blocks" ADD CONSTRAINT "program_blocks_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "rotation_programs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "program_leaders" ADD CONSTRAINT "program_leaders_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "rotation_programs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "program_leaders" ADD CONSTRAINT "program_leaders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "rotation_programs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_leader_block_id_fkey" FOREIGN KEY ("leader_block_id") REFERENCES "program_blocks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_memberships" ADD CONSTRAINT "team_memberships_block_id_fkey" FOREIGN KEY ("block_id") REFERENCES "program_blocks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
