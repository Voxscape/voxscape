import { mimeTypes } from '../shared/const';
import { prisma } from './prisma';
import { faker } from '@faker-js/faker';

describe('prisma', () => {
  it('connects to db', async () => {
    const f = await prisma.$connect();
    const q = await prisma.$queryRaw`SELECT 1+1 as result`;
    expect(q).toEqual([{ result: 2 }]);
  });
});

describe.skip('prisma with generated model classes', () => {
  it('runs', async () => {
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
  });
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

  describe.only('CRUD with nested relations', () => {
    it('CRUD on User + VoxelModel', async () => {
      const user = await prisma.user.create({
        data: {
          email: faker.internet.email(),
        },
      });

      const model = await prisma.voxelModel.create({
        data: {
          ownerUserId: user.id,
          contentType: mimeTypes.vox,
          assetUrl: faker.internet.url(),
        },
        include: {
          ownerUser: true,
        },
      });

      expect(model.ownerUser.id).toEqual(user.id);
    });

    it('allows nested insert', async () => {
      const user = await prisma.user.create({
        data: {
          email: faker.internet.email(),
        },
      });

      const m = await prisma.voxelModel.create({
        data: {
          contentType: mimeTypes.vox,
          assetUrl: faker.internet.url(),
          ownerUserId: user.id,
          // ownerUser: {
          // connect: user
          // },
          modelViews: {
            create: [
              {
                ownerUserId: user.id,
                previewImageUrl: faker.internet.url(),
                perspective: {},
              },
            ],
          },
        },
      });
    });
  });
});
