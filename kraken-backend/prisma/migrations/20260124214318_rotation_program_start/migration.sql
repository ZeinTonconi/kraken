-- CreateEnum
CREATE TYPE "ProgramStatus" AS ENUM ('DRAFT', 'ACTIVE', 'FINISHED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ProgramBlockType" ADD VALUE 'JUNIOR_BLOCK';
ALTER TYPE "ProgramBlockType" ADD VALUE 'DOCS_BLOCK';

-- AlterTable
ALTER TABLE "program_blocks" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "label" TEXT;

-- AlterTable
ALTER TABLE "rotation_programs" ADD COLUMN     "started_at" TIMESTAMP(3),
ADD COLUMN     "status" "ProgramStatus" NOT NULL DEFAULT 'DRAFT';
