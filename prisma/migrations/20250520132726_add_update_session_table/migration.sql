/*
  Warnings:

  - A unique constraint covering the columns `[gestionnaireId]` on the table `Session` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Session_gestionnaireId_key" ON "Session"("gestionnaireId");
