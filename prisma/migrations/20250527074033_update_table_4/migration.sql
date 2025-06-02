/*
  Warnings:

  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `localisation` to the `Propriete` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AuditLog" DROP CONSTRAINT "AuditLog_adminId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_adminId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_adminId_fkey";

-- AlterTable
ALTER TABLE "Gestionnaire" ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Propriete" ADD COLUMN     "localisation" JSONB NOT NULL;

-- DropTable
DROP TABLE "Admin";
