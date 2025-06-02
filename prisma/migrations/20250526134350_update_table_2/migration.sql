/*
  Warnings:

  - A unique constraint covering the columns `[adminId]` on the table `Session` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_gestionnaireId_fkey";

-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "gestionnaireId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Session_adminId_key" ON "Session"("adminId");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_gestionnaireId_fkey" FOREIGN KEY ("gestionnaireId") REFERENCES "Gestionnaire"("id") ON DELETE SET NULL ON UPDATE CASCADE;
