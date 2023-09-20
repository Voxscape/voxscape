import { t } from '../../common/_base';
import { voxRouter } from './vox';
import { requestUpload } from './upload';

export const modelRouter = t.router({
  requestUpload,
  vox: voxRouter,
});
