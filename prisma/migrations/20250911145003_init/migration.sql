-- CreateTable
CREATE TABLE "group-bill-tracker"."User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group-bill-tracker"."Activity" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "totalCost" DECIMAL(65,30) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group-bill-tracker"."Participant" (
    "id" SERIAL NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL DEFAULT 0.00,
    "accountId" INTEGER NOT NULL,
    "activityId" INTEGER NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "group-bill-tracker"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Participant_accountId_activityId_key" ON "group-bill-tracker"."Participant"("accountId", "activityId");

-- AddForeignKey
ALTER TABLE "group-bill-tracker"."Participant" ADD CONSTRAINT "Participant_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "group-bill-tracker"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group-bill-tracker"."Participant" ADD CONSTRAINT "Participant_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "group-bill-tracker"."Activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
