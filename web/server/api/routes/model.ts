import { z } from 'zod';
import { createDebugLogger } from '../../../shared/logger';
import { requireUserLogin } from '../common/auth';
import { t } from '../common/_base';

enum ModelSchema {
  vox = 'vox',
}

const modelFile = z.object({
  id: z.number().optional(),
  schema: z.enum([ModelSchema.vox]),
  url: z.string(),
});

export const uploadAssetRequest = z.object({
  filename: z.string(),
  contentType: z.string(),
});

export const uploadAssetResponse = z.object({
  uploadUrl: z.string().url(),
  url: z.string().url(),
});

const xyz = z.object({
  x: z.number(),
  y: z.number(),
  z: z.number(),
});

const modelView = z.object({
  modelId: z.onumber(),
  cameraPosition: xyz,
  cameraTarget: xyz,
});

export namespace DevOnly {
  export const demoModel = z.object({
    path: z.string(),
  });

  export const demoModelList = z.object({
    demoModels: z.array(demoModel),
  });
}

const logger = createDebugLogger(__filename);
const privateProcedure = t.procedure.use(requireUserLogin);