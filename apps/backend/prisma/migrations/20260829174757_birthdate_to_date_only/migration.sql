-- AlterTable
ALTER TABLE "user" ALTER COLUMN "birthDate" SET DATA TYPE DATE USING "birthDate"::date;
