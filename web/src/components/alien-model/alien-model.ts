import { Scene, SceneLoader, Node, AbstractMesh, AnimationGroup, Mesh } from '@babylonjs/core';

async function loadJson(url: string): Promise<unknown> {
  return fetch(url).then((response) => response.json());
}

class WTF {
  static async loadAssets(sceneLoader: typeof SceneLoader, scene: Scene) {
    // Load character model
    const characterAsset = await sceneLoader.LoadAssetContainerAsync(characterConfig.modelUrl, undefined, scene);
    characterAsset.addAllToScene();

    const characterMesh = characterAsset.meshes[0];
    const bindPoseOffset = characterAsset.animationGroups[0];

    // Load the gesture config file. This file contains options for splitting up
    // each animation in gestures.glb into 3 sub-animations and initializing them
    // as a QueueState animation.
    const gestureConfig = await loadJson(characterConfig.gestureConfigUrl);

    // Read the point of interest config file. This file contains options for
    // creating Blend2dStates from look pose clips and initializing look layers
    // on the PointOfInterestFeature.
    const poiConfig = await loadJson(characterConfig.pointOfInterestConfigUrl);

    const animClips = await this.loadCharAnimations(scene, characterMesh, bindPoseOffset);

    return { characterMesh, animClips, bindPoseOffset, gestureConfig, poiConfig };
  }

  static async loadAnimation(
    scene: Scene,
    childMeshes: Node[],
    url: string,
    clipGroupId: string,
  ): Promise<{ clipGroupId: string; clips: AnimationGroup[] }> {
    const container = await SceneLoader.LoadAssetContainerAsync(url, undefined, scene);

    const startingIndex = scene.animatables.length;
    const firstIndex = scene.animationGroups.length;

    // Apply animation to character
    container.mergeAnimationsTo(
      scene,
      scene.animatables.slice(startingIndex),
      (target) => childMeshes.find((mesh) => mesh.name === target.name) || null,
    );

    // Find the new animations and destroy the container
    const clips = scene.animationGroups.slice(firstIndex);
    container.dispose();
    scene.onAnimationFileImportedObservable.notifyObservers(scene);

    return { clipGroupId, clips };
  }

  static async loadCharAnimations(scene: Scene, characterMesh: AbstractMesh, bindPoseOffset: AnimationGroup) {
    const {
      animStandIdleUrl,
      animLipSyncUrl,
      animGestureUrl,
      animEmoteUrl,
      animFaceIdleUrl,
      animBlinkUrl,
      animPointOfInterestUrl,
    } = characterConfig.animUrls;

    if (bindPoseOffset) {
      AnimationGroup.MakeAnimationAdditive(bindPoseOffset);
    }

    const childMeshes = characterMesh.getDescendants(false);

    const animationLoadingPromises = await Promise.all([
      this.loadAnimation(scene, childMeshes, animStandIdleUrl, 'idleClips'),
      this.loadAnimation(scene, childMeshes, animLipSyncUrl, 'lipSyncClips'),
      this.loadAnimation(scene, childMeshes, animGestureUrl, 'gestureClips'),
      this.loadAnimation(scene, childMeshes, animEmoteUrl, 'emoteClips'),
      this.loadAnimation(scene, childMeshes, animFaceIdleUrl, 'faceClips'),
      this.loadAnimation(scene, childMeshes, animBlinkUrl, 'blinkClips'),
      this.loadAnimation(scene, childMeshes, animPointOfInterestUrl, 'poiClips'),
    ] as const);

    const animLoadingResults = await Promise.all(animationLoadingPromises);

    const animClips: Record<string, AnimationGroup[]> = {};
    animLoadingResults.forEach((result) => {
      animClips[result.clipGroupId] = result.clips;
    });

    return animClips;
  }
}

async function loadModels(scene: Scene): Promise<void> {}

const characterConfig = {
  modelUrl: '/character-assets/characters/alien/alien.gltf',
  gestureConfigUrl: '/character-assets/animations/alien/gesture.json',
  pointOfInterestConfigUrl: '/character-assets/animations/alien/poi.json',
  animUrls: {
    animStandIdleUrl: '/character-assets/animations/alien/stand_idle.glb',
    animLipSyncUrl: '/character-assets/animations/alien/lipsync.glb',
    animGestureUrl: '/character-assets/animations/alien/gesture.glb',
    animEmoteUrl: '/character-assets/animations/alien/emote.glb',
    animFaceIdleUrl: '/character-assets/animations/alien/face_idle.glb',
    animBlinkUrl: '/character-assets/animations/alien/blink.glb',
    animPointOfInterestUrl: '/character-assets/animations/alien/poi.glb',
  },
  lookJoint: 'char:gaze',
} as const;
