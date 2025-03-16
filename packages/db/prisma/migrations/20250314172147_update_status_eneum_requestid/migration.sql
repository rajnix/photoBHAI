/*
  Warnings:

  - The values [Completed] on the enum `StatusEnum` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "ModelTrainingStatusEnum" AS ENUM ('Pending', 'Completed', 'Failed');

-- AlterEnum
BEGIN;
CREATE TYPE "StatusEnum_new" AS ENUM ('Pending', 'Generated', 'Failed');
ALTER TABLE "OutputImages" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "OutputImages" ALTER COLUMN "status" TYPE "StatusEnum_new" USING ("status"::text::"StatusEnum_new");
ALTER TYPE "StatusEnum" RENAME TO "StatusEnum_old";
ALTER TYPE "StatusEnum_new" RENAME TO "StatusEnum";
DROP TYPE "StatusEnum_old";
ALTER TABLE "OutputImages" ALTER COLUMN "status" SET DEFAULT 'Pending';
COMMIT;

-- AlterTable
ALTER TABLE "Model" ADD COLUMN     "falAIrequestID" TEXT,
ADD COLUMN     "tensorPath" TEXT,
ADD COLUMN     "trainingStatus" "ModelTrainingStatusEnum" NOT NULL DEFAULT 'Pending',
ADD COLUMN     "triggerWord" TEXT;

-- AlterTable
ALTER TABLE "OutputImages" ADD COLUMN     "falAIrequestID" TEXT,
ALTER COLUMN "imageUrl" SET DEFAULT '';
