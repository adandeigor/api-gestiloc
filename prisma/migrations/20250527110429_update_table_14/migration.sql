/*
  Warnings:

  - A unique constraint covering the columns `[contratId]` on the table `EtatDesLieux` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `type` on the `EtatDesLieux` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TypeEtatDesLieux" AS ENUM ('ENTREE', 'SORTIE');

-- AlterTable
ALTER TABLE "EtatDesLieux" DROP COLUMN "type",
ADD COLUMN     "type" "TypeEtatDesLieux" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "EtatDesLieux_contratId_key" ON "EtatDesLieux"("contratId");
