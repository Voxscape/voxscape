/**
 * A wrapper to read numbers / strings / RIFF chunks from byte array
 */
export class RiffLense {
  private readonly uint8Array: Uint8Array;
  private readonly dataView: DataView;
  constructor(bytes: ArrayBuffer) {
    this.uint8Array = new Uint8Array(bytes);
    this.dataView = new DataView(bytes);
  }

  asciiAt(start: number, length: number): string {
    return String.fromCharCode(...(this.uint8Array.slice(start, start + length) as any as number[]));
  }

  int32At(start: number, littleEndian = true): number {
    return this.dataView.getInt32(start, littleEndian);
  }

  int8At(offset: number): number {
    return this.dataView.getInt8(offset);
  }

  uint8At(offset: number): number {
    return this.dataView.getUint8(offset);
  }

  uint32At(offset: number, littleEndian = true): number {
    return this.dataView.getUint32(offset, littleEndian);
  }

  float32At(offset: number): number {
    return this.dataView.getFloat32(offset);
  }

  chunkAt(start: number): Chunk {
    // NOT validating ranges of chunks
    const id = this.asciiAt(start, 4);
    const numContentBytes = this.int32At(start + 4);
    const numChildrenBytes = this.int32At(start + 8);
    const contentStart = start + 12;
    const childrenStart = contentStart + numContentBytes;
    const end = childrenStart + numChildrenBytes;
    return {
      start,
      id,
      numContentBytes,
      numChildrenBytes,
      contentStart,
      childrenStart,
      end,
    };
  }

  childrenChunksIn(parent: Chunk): readonly Chunk[] {
    const ret: Chunk[] = [];
    let p = parent.childrenStart;
    while (p < parent.end) {
      const child = this.chunkAt(p);
      ret.push(child);
      p = child.end;
    }

    return ret;
  }
}

export interface Chunk {
  readonly start: number;
  readonly id: string;
  readonly numContentBytes: number;
  readonly numChildrenBytes: number;

  readonly contentStart: number;
  readonly childrenStart: number;
  readonly end: number;
}
