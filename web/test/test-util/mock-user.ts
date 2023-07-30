import { User } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { TestResource, useTestResource } from './test-resource';
import { prisma } from '../../server/prisma';

export function useMockUser(options?: { emailVerified?: boolean }): TestResource<User> {
  return useTestResource<User>(async () => {
    return prisma.user.create({
      data: {
        email: faker.internet.email(),
        emailVerified: options?.emailVerified ? faker.date.past() : null,
      },
    });
  });
}
