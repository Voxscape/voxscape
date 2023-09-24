import { Prisma, PrismaClient } from '@prisma/client';

function getLogLevels(env: string): Prisma.LogLevel[] {
  switch (env) {
    case 'production':
      return ['info', 'warn', 'error'];
    default:
      return ['query', 'info', 'warn', 'error'];
  }
}

export const prisma = new PrismaClient({
  log: getLogLevels(process.env.NODE_ENV),
});
