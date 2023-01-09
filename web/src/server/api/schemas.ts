import { z } from 'zod';

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
