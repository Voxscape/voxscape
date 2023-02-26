import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const allUsers = await prisma.user.findMany({ where: {} });
  console.debug('allUsers', allUsers);

  const user = await prisma.user.create({
    data: {
      name: 'alize',
      email: 'alice@prisma.io',
    },
  });
  // ... you will write your Prisma Client queries here
  console.debug('user', user);
  user.email;
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })

  .catch(async (e) => {
    console.error(e);

    await prisma.$disconnect();

    process.exit(1);
  });
