-- CreateEnum
CREATE TYPE "GestionnaireRole" AS ENUM ('GESTIONNAIRE', 'PARTICULIER');

-- CreateTable
CREATE TABLE "DossierGestionnaire" (
    "id" SERIAL NOT NULL,
    "ifu" TEXT NOT NULL,
    "carte_identite" TEXT NOT NULL,
    "registre_commerce" TEXT,
    "role" "GestionnaireRole",
    "gestionnaireId" INTEGER NOT NULL,

    CONSTRAINT "DossierGestionnaire_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DossierGestionnaire_gestionnaireId_key" ON "DossierGestionnaire"("gestionnaireId");

-- AddForeignKey
ALTER TABLE "DossierGestionnaire" ADD CONSTRAINT "DossierGestionnaire_gestionnaireId_fkey" FOREIGN KEY ("gestionnaireId") REFERENCES "Gestionnaire"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
