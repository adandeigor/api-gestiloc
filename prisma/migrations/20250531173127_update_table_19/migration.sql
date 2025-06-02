/*
  Warnings:

  - A unique constraint covering the columns `[locataireId,uniteLocativeId,dateDebut]` on the table `Contrat` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "Contrat_locataireId_uniteLocativeId_idx" ON "Contrat"("locataireId", "uniteLocativeId");

-- CreateIndex
CREATE UNIQUE INDEX "Contrat_locataireId_uniteLocativeId_dateDebut_key" ON "Contrat"("locataireId", "uniteLocativeId", "dateDebut");
