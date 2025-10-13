import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // --- Define credentials here ONLY when running the script ---
  const adminEmail = 'your-email-here@domain.com';
  const adminPassword = 'SET_A_STRONG_PASSWORD_HERE_TEMPORARILY';
  // -------------------------------------------------------------

  const oldDevUserEmail = 'admin@example.com';

  // Security lock to prevent running the script accidentally without a password
  if (adminPassword === 'SET_A_STRONG_PASSWORD_HERE_TEMPORARILY') {
    console.log('----------------------------------------------------');
    console.log('🛑 Please set a password in the prisma/seed.ts file before running.');
    console.log('----------------------------------------------------');
    return;
  }

  // Feedback log: Useful to know the script started.
  console.log('Starting seed script...');

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await prisma.$transaction(async (tx) => {
    const existingOldUser = await tx.user.findUnique({ where: { email: oldDevUserEmail } });
    if (existingOldUser) {
      await tx.user.delete({ where: { email: oldDevUserEmail } });
      // Feedback log: Confirms the action.
      console.log(`Old development user (${oldDevUserEmail}) removed.`);
    }

    const adminUser = await tx.user.upsert({
      where: { email: adminEmail },
      update: { password: hashedPassword },
      create: {
        email: adminEmail,
        password: hashedPassword,
        name: 'Admin',
        role: 'admin',
      },
    });
    // Feedback log: Confirms the main action.
    console.log(`Main admin user (${adminUser.email}) has been created/updated.`);
  });
  
  // Final feedback log
  console.log('✅ Seed script finished successfully.');
}

main()
  .catch((e) => {
    // Error log: Essential for debugging. NEVER remove.
    console.error('❌ Error running seed script:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });