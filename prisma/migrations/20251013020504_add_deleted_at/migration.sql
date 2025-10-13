/*
  Warnings:

  - You are about to drop the column `isDeleted` on the `Activity` table. All the data in the column will be lost.
  - You are about to alter the column `totalCost` on the `Activity` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to drop the column `isDeleted` on the `Participant` table. All the data in the column will be lost.
  - You are about to alter the column `amount` on the `Participant` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "group-bill-tracker"."Activity" DROP COLUMN "isDeleted",
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ALTER COLUMN "totalCost" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "group-bill-tracker"."Participant" DROP COLUMN "isDeleted",
ADD COLUMN     "deleteAt" TIMESTAMP(3),
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(10,2);
