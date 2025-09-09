/*
  Warnings:

  - You are about to drop the column `eventId` on the `Participant` table. All the data in the column will be lost.
  - You are about to drop the `Event` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[accountId,activityId]` on the table `Participant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `activityId` to the `Participant` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "group-bill-tracker"."Participant" DROP CONSTRAINT "Participant_eventId_fkey";

-- DropIndex
DROP INDEX "group-bill-tracker"."Participant_accountId_eventId_key";

-- AlterTable
ALTER TABLE "group-bill-tracker"."Participant" DROP COLUMN "eventId",
ADD COLUMN     "activityId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "group-bill-tracker"."Event";

-- CreateTable
CREATE TABLE "group-bill-tracker"."Activity" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "totalCost" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Participant_accountId_activityId_key" ON "group-bill-tracker"."Participant"("accountId", "activityId");

-- AddForeignKey
ALTER TABLE "group-bill-tracker"."Participant" ADD CONSTRAINT "Participant_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "group-bill-tracker"."Activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
