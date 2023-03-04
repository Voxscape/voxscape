import React, { useRef } from 'react';
import {
  BoxGeometry,
  BufferGeometry,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three';

import { css } from '@emotion/react';
import { useAsyncEffect } from '@jokester/ts-commonutil/lib/react/hook/use-async-effect';
import { wait } from '@jokester/ts-commonutil/lib/concurrency/timing';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useFps } from '@jokester/ts-commonutil/lib/react/hook/use-fps';

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
  const material = new MeshBasicMaterial({ color: 0x00ff00 });
  // mesh 'transform-al' or 'world' coordinates
  return new Mesh(geometry, material);
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
