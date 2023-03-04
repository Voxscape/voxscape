import React, { useEffect, useRef } from 'react';
import { Scene, PerspectiveCamera, WebGLRenderer } from 'three';

import { css } from '@emotion/react';

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
