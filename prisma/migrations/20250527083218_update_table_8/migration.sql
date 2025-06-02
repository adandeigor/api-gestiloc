/*
  Warnings:

  - A unique constraint covering the columns `[uniteLocativeId]` on the table `Locataire` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Locataire_uniteLocativeId_key" ON "Locataire"("uniteLocativeId");
