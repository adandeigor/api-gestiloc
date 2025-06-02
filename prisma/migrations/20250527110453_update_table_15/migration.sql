/*
  Warnings:

  - A unique constraint covering the columns `[contratId,type]` on the table `EtatDesLieux` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "EtatDesLieux_contratId_key";

-- CreateIndex
CREATE UNIQUE INDEX "EtatDesLieux_contratId_type_key" ON "EtatDesLieux"("contratId", "type");
