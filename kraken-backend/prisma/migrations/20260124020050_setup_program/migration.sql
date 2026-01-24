/*
  Warnings:

  - The values [ACTIVE] on the enum `EnrollmentStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EnrollmentStatus_new" AS ENUM ('APPLIED', 'APPROVED', 'REJECTED', 'DROPPED');
ALTER TABLE "public"."enrollments" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "enrollments" ALTER COLUMN "status" TYPE "EnrollmentStatus_new" USING ("status"::text::"EnrollmentStatus_new");
ALTER TYPE "EnrollmentStatus" RENAME TO "EnrollmentStatus_old";
ALTER TYPE "EnrollmentStatus_new" RENAME TO "EnrollmentStatus";
DROP TYPE "public"."EnrollmentStatus_old";
ALTER TABLE "enrollments" ALTER COLUMN "status" SET DEFAULT 'APPLIED';
COMMIT;

-- AlterTable
ALTER TABLE "enrollments" ADD COLUMN     "pref_role_1" "JobRole",
ADD COLUMN     "pref_role_2" "JobRole",
ADD COLUMN     "pref_role_3" "JobRole",
ADD COLUMN     "primary_role" "JobRole",
ALTER COLUMN "status" SET DEFAULT 'APPLIED';

-- AlterTable
ALTER TABLE "rotation_programs" ADD COLUMN     "target_backend_pct" INTEGER NOT NULL DEFAULT 30,
ADD COLUMN     "target_devops_pct" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "target_frontend_pct" INTEGER NOT NULL DEFAULT 30,
ADD COLUMN     "target_qa_pct" INTEGER NOT NULL DEFAULT 30;
