import React, { useEffect, useRef } from 'react';
import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshBasicMaterial, Mesh } from 'three';

import { css } from '@emotion/react';
import { useAsyncEffect } from '@jokester/ts-commonutil/lib/react/hook/use-async-effect';
import { wait } from '@jokester/ts-commonutil/lib/concurrency/timing';

function init(canvas: HTMLCanvasElement) {
  const scene = new Scene();

  const camera = new PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);

  const renderer = new WebGLRenderer({ canvas });

  const geometry = new BoxGeometry(1, 1, 1);
  const material = new MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new Mesh(geometry, material);
  scene.add(cube);

  return { scene, camera, renderer, cube };
}

export function ThreejsSandbox(): React.ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useAsyncEffect(async (mounted, effectReleased) => {
    await wait(0.1e3);
    if (!(canvasRef.current && mounted.current)) {
      return;
    }
    const { cube, renderer, camera, scene } = init(canvasRef.current);
    camera.position.z = 5;

    const renderFrame = () => {
      if (!mounted.current) {
        return;
      }
      renderer.render(scene, camera);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      requestAnimationFrame(renderFrame);
    };

    renderFrame();

    return () => {
      renderer.dispose();
    };
  }, []);

  return (
    <div>
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
