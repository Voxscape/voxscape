import { z } from 'zod';
import { mimeTypes } from './const';

export const createModelRequest = z.object({
  title: z.string(),
  desc: z.string(),
  origFilename: z.string(),
  contentType: z.string().and(z.enum([mimeTypes.vox])),
  assetUrl: z.string().url(),
  isPrivate: z.boolean(),
});
