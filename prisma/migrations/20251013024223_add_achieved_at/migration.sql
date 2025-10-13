/*
  Warnings:

  - You are about to drop the column `deleteAt` on the `Participant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "group-bill-tracker"."Participant" DROP COLUMN "deleteAt",
ADD COLUMN     "deletedAt" TIMESTAMP(3);
