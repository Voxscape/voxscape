import { ArcRotateCamera } from '@babylonjs/core';
import * as VoxTypes from '../types/vox-types';

export function resetCameraForModel(camera: ArcRotateCamera, forModel: VoxTypes.VoxelModel) {
  const lower = 0.5 * Math.min(forModel.size.x, forModel.size.y, forModel.size.z);
  const upper = 1.5 * Math.max(forModel.size.x, forModel.size.y, forModel.size.z);
  camera.lowerRadiusLimit = lower;
  camera.upperRadiusLimit = upper;
  camera.radius = upper;
}
