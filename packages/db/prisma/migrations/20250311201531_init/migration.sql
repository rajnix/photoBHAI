/*
  Warnings:

  - The values [AsianAmerican,EastAsian,SouthAsian,MiddleEastern,SouthEastAsian] on the enum `ModelEthnicityEnum` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ModelEthnicityEnum_new" AS ENUM ('White', 'Black', 'Asian', 'Asian American', 'East Asian', 'South Asian', 'Hispanic', 'Pacific', 'Middle Eastern', 'South East Asian');
ALTER TABLE "Model" ALTER COLUMN "ethnicity" TYPE "ModelEthnicityEnum_new" USING ("ethnicity"::text::"ModelEthnicityEnum_new");
ALTER TYPE "ModelEthnicityEnum" RENAME TO "ModelEthnicityEnum_old";
ALTER TYPE "ModelEthnicityEnum_new" RENAME TO "ModelEthnicityEnum";
DROP TYPE "ModelEthnicityEnum_old";
COMMIT;
