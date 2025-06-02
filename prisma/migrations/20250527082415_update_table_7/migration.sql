/*
  Warnings:

  - Added the required column `carte_identite` to the `Locataire` table without a default value. This is not possible if the table is not empty.
  - Made the column `prenom` on table `Locataire` required. This step will fail if there are existing NULL values in that column.
  - Made the column `telephone` on table `Locataire` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Locataire" ADD COLUMN     "carte_identite" TEXT NOT NULL,
ADD COLUMN     "photo_identite" TEXT,
ALTER COLUMN "prenom" SET NOT NULL,
ALTER COLUMN "telephone" SET NOT NULL;
