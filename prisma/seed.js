const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@google.com";
  const hashedPassword = await bcrypt.hash("12345678", 10);

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        name: "Super Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
      },
    });
    console.log("✅ Admin user created!");
  } else {
    console.log("⚠️ Admin user already exists.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
