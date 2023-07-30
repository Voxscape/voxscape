import { prisma } from './prisma';
import { faker } from '@faker-js/faker';

describe('prisma', () => {
  it('connects to db', async () => {
    const f = await prisma.$connect();
    const q = await prisma.$queryRaw`SELECT 1+1 as result`;
    expect(q).toEqual([{ result: 2 }]);
  });
});

describe('prisma with generated model classes', () => {
  it('CRUD on User', async () => {
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
      },
    });

    expect(user.email).toMatch(/.+@.+\..+/);
    expect(user.emailVerified).toBe(null);

    /**
     * email is in small case
     */
    const notFound = await prisma.user.findUnique({
      where: {
        email: user.email?.toUpperCase(),
      },
    });
    expect(notFound).toEqual(null);

    const reloaded = await prisma.user.findUnique({
      where: {
        email: user.email!,
      },
    });
    expect(reloaded).toBeTruthy();
  });
});
