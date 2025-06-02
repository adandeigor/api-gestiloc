/*
  Warnings:

  - Added the required column `adresse` to the `DossierGestionnaire` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code_postal` to the `DossierGestionnaire` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date_naissance` to the `DossierGestionnaire` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nationalite` to the `DossierGestionnaire` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pays` to the `DossierGestionnaire` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ville` to the `DossierGestionnaire` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DossierGestionnaire" ADD COLUMN     "adresse" TEXT NOT NULL,
ADD COLUMN     "code_postal" TEXT NOT NULL,
ADD COLUMN     "date_naissance" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "nationalite" TEXT NOT NULL,
ADD COLUMN     "pays" TEXT NOT NULL,
ADD COLUMN     "ville" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "registre_commerce" TEXT,
    "address" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "description" TEXT NOT NULL,
    "gestionnaireId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_gestionnaireId_key" ON "Company"("gestionnaireId");

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_gestionnaireId_fkey" FOREIGN KEY ("gestionnaireId") REFERENCES "DossierGestionnaire"("id") ON DELETE SET NULL ON UPDATE CASCADE;
