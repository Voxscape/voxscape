import { prisma } from './prisma';

describe('prisma', () => {
  it('connects to db', async () => {
    const f = await prisma.$connect();
    const q = await prisma.$queryRaw`SELECT 1+1 as result`;
    expect(q).toEqual([{ result: 2 }]);
  });
});
