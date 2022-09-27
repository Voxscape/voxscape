declare module 'vox.js' {
  import Three from 'three';

  // color: 0~255 ranged int
  interface Color {
    r: number;
    g: number;
    b: number;
    a: number;
  }

  interface Voxel {
    x: number;
    y: number;
    z: number;
    colorIndex: number;
  }

  interface MeshBuilderParam {
    voxelSize: number;
    vertexColor: boolean;
    optimizeFaces: boolean;
    originToBottom: boolean;
  }

  namespace vox {
    function md5(data: string): string;

    const defaultPalette: Color[];

    class Xhr {
      getBinary(url: string): Promise<Uint8Array>;
    }

    class MeshBuilder {
      constructor(voxelData: Uint8Array, param?: Partial<MeshBuilderParam>);
      geometry: Three.Geometry;
      material: Three.MeshPhongMaterial;
      static DEFAULT_PARAM: MeshBuilderParam;
    }

    class TextureFactory {
      createCanvas(voxelData: VoxelData): HTMLCanvasElement;
      getTexture(voxelData: VoxelData): Three.Texture;
    }

    class VoxelData {
      size: { x: number; y: number; z: number };
      voxels: Voxel[];
      palette: Color[];
    }

    class Parser {
      parse(url: string): Promise<VoxelData>;

      // only valid in real node.js
      parseFile(path: string, callback: (error: Error | null, voxelData?: VoxelData) => void): void;

      parseUint8Array(uint8array: Uint8Array, callback: (error: Error | null, voxelData?: VoxelData) => void): void;
    }

    // NOT exposing: DataHolder
  }

  export = vox;
}
