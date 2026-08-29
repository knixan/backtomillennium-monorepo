/*
  Warnings:

  - Added the required column `birthDate` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nickname` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sexAssignedAtBirth` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "birthDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "nickname" TEXT NOT NULL,
ADD COLUMN     "sexAssignedAtBirth" TEXT NOT NULL;
