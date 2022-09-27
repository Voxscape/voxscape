import { uint32ToColor } from './basic-parser';

describe('basic-parser.ts', () => {
  describe(uint32ToColor, () => {
    it('parsed color', () => {
      expect(uint32ToColor(0xff0ab0ee)).toEqual({
        r: 0xff,
        g: 0x0a,
        b: 0xb0,
        a: 0xee,
      });
    });
  });
});
