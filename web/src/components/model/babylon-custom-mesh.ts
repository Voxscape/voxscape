import { DynamicTexture, Mesh, VertexData } from '@babylonjs/core';

async function wtf(mesh: Mesh): Promise<void> {
  const vertexData = new VertexData();
  vertexData.uvs = [];

  const mesh = new Mesh('empty');
  vertexData.applyToMesh(mesh);
  VertexData.ComputeNormals();
  mesh.material = null;
}

async function wtf(params: unknown): Promise<void> {
  const m = new DynamicTexture('xxxxxx', {});

  m.getContext().drawImage('img', 1, 1, 0, 0, 0, 0, 0, 0);
}
