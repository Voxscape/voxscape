import { t } from '../../common/_base';
import { voxRouter } from './vox';
import { modelListRoutes } from './aggregates';

export const modelRouter = t.router({
  vox: voxRouter,
  ...modelListRoutes,
});
