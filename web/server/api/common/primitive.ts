import type * as Prisma from '@prisma/client';
import { z } from 'zod';

export const pagerParam = z.object({
  limit: z.number({}).int().min(25).max(200).optional(),
  offset: z.number().int().optional(),
});

const safeUser = z.object({
  id: z.ostring(),
  name: z.ostring(),
  // no email
  emailVerified: z.oboolean(),
  image: z.ostring(),
  createdAt: z.date(),
});

export type SafeUser = z.infer<typeof safeUser>;

export function pickSafeUser(u: Prisma.User): z.infer<typeof safeUser> {
  return safeUser.parse(u);
}
