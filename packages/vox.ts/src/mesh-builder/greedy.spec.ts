import * as greedy from './greedy';

describe('splitRow', () => {
  it('does not split when all voxels are consequent', () => {
    const split = greedy.splitRow([
      {
        x: 0,
        y: 0,
        z: 0,
        colorIndex: 0,
      },
      {
        x: 0,
        y: 0,
        z: 1,
        colorIndex: 0,
      },
    ]);
    expect(split).toHaveLength(1);
  });
  it('splits inconsequent', () => {
    const split = greedy.splitRow([
      {
        x: 0,
        y: 0,
        z: 0,
        colorIndex: 0,
      },
    ]);
  });
});
