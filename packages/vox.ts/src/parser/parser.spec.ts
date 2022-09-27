import { chrFoxVox, deerVox, monu8Vox } from '../__test__/ref-models';
import { RiffLense } from '../util/riff-lense';
import { basicParser } from './basic-parser';

describe('parser', () => {
  describe('lenses', () => {
    it('can be used to read bytes', () => {
      const testee = new RiffLense(chrFoxVox);
      expect(testee.asciiAt(0, 4)).toEqual('VOX ');
      expect(testee.int32At(4)).toEqual(150);
      expect(testee.int32At(0x10)).toEqual(0x0d08);
    });

    it('reads chunks from single-model .vox file', () => {
      const testee = new RiffLense(chrFoxVox);

      const mainChunk = testee.chunkAt(8);
      expect(mainChunk).toMatchSnapshot('chrFoxVox/main');

      const sizeChunk = testee.chunkAt(mainChunk.childrenStart);
      expect(mainChunk).toMatchSnapshot('chrFoxVox/main/size0');

      const xyziChunk = testee.chunkAt(sizeChunk.end);
      expect(xyziChunk).toMatchSnapshot('chrFoxVox/main/xyzi0');

      const rgbaChunk = testee.chunkAt(xyziChunk.end);
      expect(rgbaChunk).toMatchSnapshot('chrFoxVox/main/rgba');

      const mainChildren = testee.childrenChunksIn(mainChunk);
      expect(mainChildren).toEqual([sizeChunk, xyziChunk, rgbaChunk]);

      expect(rgbaChunk.end).toEqual(new Uint8Array(chrFoxVox).length);
    });
  });

  describe('basic-parser', () => {
    it('parses chrFoxVox', () => {
      const parsed = basicParser(chrFoxVox);
      expect(parsed).toMatchSnapshot('basicParser(chrFoxVox)');
    });

    it('parses monu8Vox', () => {
      const parsed = basicParser(monu8Vox);
      expect(parsed.models.length).toEqual(1);
      expect(parsed.materials).toHaveLength(0);
      expect(parsed.palette).toHaveLength(256);
    });

    it('parses deerVox', () => {
      const parsed = basicParser(deerVox);
    });
  });
});
