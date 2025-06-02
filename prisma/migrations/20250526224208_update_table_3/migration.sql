/*
  Warnings:

  - You are about to drop the column `registre_commerce` on the `Company` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Company" DROP COLUMN "registre_commerce",
ADD COLUMN     "registre_commerce_file" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "registre_commerce_number" TEXT NOT NULL DEFAULT '';
