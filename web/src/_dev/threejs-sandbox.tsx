import React, { useRef } from 'react';
import {
  BoxGeometry,
  BufferGeometry,
  Line,
  LineBasicMaterial,
  LoadingManager,
  Object3D,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
  PointLight,
  DirectionalLight,
  MeshPhongMaterial,
} from 'three';

import { css } from '@emotion/react';
import { useAsyncEffect } from '@jokester/ts-commonutil/lib/react/hook/use-async-effect';
import { wait } from '@jokester/ts-commonutil/lib/concurrency/timing';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useFps } from '@jokester/ts-commonutil/lib/react/hook/use-fps';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { createDebugLogger } from '../../shared/logger';
const logger = createDebugLogger(__filename);

function init(canvas: HTMLCanvasElement) {
  const scene = new Scene();

  const camera = new PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);

  const renderer = new WebGLRenderer({ canvas, antialias: true, failIfMajorPerformanceCaveat: true });

  const controls = new OrbitControls(camera, renderer.domElement);

  return { scene, camera, renderer, controls };
}

function createCube(scene: Scene): Mesh {
  // geometry: local or "intrinsic" coordinates
  const geometry = new BoxGeometry(5, 5, 5);
  const material = new MeshPhongMaterial({ color: 0x00ff00 });
  // mesh 'transform-al' or 'world' coordinates
  return new Mesh(geometry, material);
}

const loadingManager = new LoadingManager(
  () => {
    logger('load');
  },
  (url, itemsLoaded, itemsTotal) => {
    logger('progress', url, itemsLoaded, itemsTotal);
  },
  (url) => {
    logger('error loading', url);
  },
);

function createLight() {
  const color = 0xffffff;
  const intensity = 1;
  const light = new DirectionalLight(color, intensity);
  light.position.set(-1, 2, 4);
  return light;
}

async function loadGltf(url: string) {
  const loader = new GLTFLoader(loadingManager);
  const gltf = await loader.loadAsync(url);

  logger('loaded', gltf);

  return gltf;
}

function createPoints(scene: Scene): Line {
  //create a blue LineBasicMaterial
  const material = new LineBasicMaterial({ color: 0x0000ff });

  const points = [];
  points.push(new Vector3(-10, 0, 0));
  points.push(new Vector3(0, 10, 0));
  points.push(new Vector3(10, 0, 0));

  const geometry = new BufferGeometry().setFromPoints(points);

  return new Line(geometry, material);
}

export function ThreejsSandbox(): React.ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const fps = useFps(60);

  useAsyncEffect(async (mounted, effectReleased) => {
    await wait(0.1e3);
    if (!(canvasRef.current && mounted.current)) {
      return;
    }
    const { renderer, camera, scene } = init(canvasRef.current);

    const cube = createCube(scene);
    const line = createPoints(scene);
    scene.add(cube);
    scene.add(line);

    camera.position.z = 10;

    const gltf = await loadGltf('/demo-models/batch_0302.blend.glb');

    {
      scene.add(createLight());
    }

    {
      const l = gltf.scene.getObjectByName('light-point1');
      logger('found object', l, l instanceof Object3D, l instanceof PointLight);
      if (l) {
        scene.add(l);
      }
    }

    {
      const f = gltf.scene.getObjectByName('メッシュ016');
      logger('found object', f, f instanceof Object3D, f instanceof Mesh);
      if (f) {
        scene.add(f);
      }
    }

    const renderFrame = () => {
      if (!mounted.current) {
        return;
      }
      renderer.render(scene, camera);
      cube.rotation.y += 0.01;
      requestAnimationFrame(renderFrame);
    };

    renderFrame();

    await effectReleased;
    renderer.dispose();
  }, []);

  return (
    <div className="relative">
      <span className="absolute top-0 left-0 text-white">FPS: {fps.toFixed(2)}</span>
      <canvas
        css={css`
          outline: 1px dotted red;
        `}
        ref={canvasRef}
        width={800}
        height={600}
      />
    </div>
  );
}
