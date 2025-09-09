-- CreateTable
CREATE TABLE "group-bill-tracker"."Event" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "totalCost" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group-bill-tracker"."Participant" (
    "id" SERIAL NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL DEFAULT 0.00,
    "accountId" INTEGER NOT NULL,
    "eventId" INTEGER NOT NULL,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Participant_accountId_eventId_key" ON "group-bill-tracker"."Participant"("accountId", "eventId");

-- AddForeignKey
ALTER TABLE "group-bill-tracker"."Participant" ADD CONSTRAINT "Participant_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "group-bill-tracker"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group-bill-tracker"."Participant" ADD CONSTRAINT "Participant_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "group-bill-tracker"."Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
