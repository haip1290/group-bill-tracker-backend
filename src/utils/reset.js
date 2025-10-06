const { PrismaClient } = require("./src/generated/prisma"); // Adjust path as needed

const prisma = new PrismaClient();

// List tables in the correct order to avoid foreign key issues
const tables = ["Participant", "Activity", "User"];

async function main() {
  console.log("Starting database data truncation...");

  // Truncate tables with CASCADE to reset the sequence counters
  for (const table of tables) {
    await prisma.$executeRawUnsafe(
      `TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE;`
    );
    console.log(`Truncated table: ${table}`);
  }

  console.log("Database data successfully truncated.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
