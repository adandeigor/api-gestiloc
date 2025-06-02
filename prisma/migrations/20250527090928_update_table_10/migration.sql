/*
  Warnings:

  - Added the required column `typeContrat` to the `Contrat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Contrat" ADD COLUMN     "typeContrat" TEXT NOT NULL;
