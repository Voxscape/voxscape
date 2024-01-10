import { t } from '../../common/_base';
import { createDebugLogger } from '../../../../shared/logger';
import { pagerParam } from '../../common/primitive';
import { prisma } from '../../../prisma';
import { z } from 'zod';

const logger = createDebugLogger(__filename);

const searchModelQuery = z
  .object({
    query: z.string(),
  })
  .and(pagerParam);

export const modelListRoutes = {
  recent: t.procedure.input(pagerParam).query(async ({ input }) => {
    const voxModels = await prisma.voxFile.findMany({
      where: {},
      orderBy: { createdAt: 'desc' },
      take: Math.min(input?.limit ?? 20, 100),
      skip: input?.offset ?? 0,
    });
    return { voxModels };
  }),

  search: t.procedure.input(searchModelQuery).query(async ({ input }) => {
    const voxModels = await prisma.voxFile.findMany({
      where: {
        OR: [
          {
            desc: {
              contains: input.query,
            },
          },
          {
            title: {
              contains: input.query,
            },
          },
        ],
      },
      take: Math.min(input?.limit ?? 20, 100),
      skip: input?.offset ?? 0,
      orderBy: [{ updatedAt: 'desc' }],
    });
    return { voxModels };
  }),
} as const;
