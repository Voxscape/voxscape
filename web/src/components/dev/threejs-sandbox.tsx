import React, { useEffect, useRef } from 'react';
import { Scene, PerspectiveCamera, WebGLRenderer } from 'three';

function init(canvas: HTMLCanvasElement) {
  const scene = new Scene();

  const camera = new PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);

  const renderer = new WebGLRenderer({ canvas });
}

export function ThreejsSandbox(): React.ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    init(canvasRef.current!);
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} width={800} height={600} />
    </div>
  );
}
