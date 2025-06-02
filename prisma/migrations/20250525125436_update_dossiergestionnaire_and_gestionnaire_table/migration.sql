/*
  Warnings:

  - You are about to drop the column `carte_identite` on the `DossierGestionnaire` table. All the data in the column will be lost.
  - You are about to drop the column `ifu` on the `DossierGestionnaire` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "GestionnaireStatut" AS ENUM ('VALIDE', 'EN_ATTENTE');

-- AlterTable
ALTER TABLE "DossierGestionnaire" DROP COLUMN "carte_identite",
DROP COLUMN "ifu",
ADD COLUMN     "carte_identite_file" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "carte_identite_number" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "ifu_file" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "ifu_number" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Gestionnaire" ADD COLUMN     "statut" "GestionnaireStatut" NOT NULL DEFAULT 'EN_ATTENTE';
