import * as greedy from './greedy';

describe(greedy.buildVertexIndex.name, () => {
  it('builds vertex index', () => {
    expect(greedy.buildVertexIndex([])).toEqual([]);
    expect(greedy.buildVertexIndex([1, 2, 3])).toEqual([0]);
    expect(() => greedy.buildVertexIndex([1])).toThrow();
    expect(() => greedy.buildVertexIndex([1, 3])).toThrow();
  });
});

describe('splitRow', () => {
  it('does not split when all voxels are consequent', () => {
    const beforeSplit = [
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
    ];
    const split = greedy.splitRow(beforeSplit);
    expect(split).toHaveLength(1);
    expect(split).toEqual([
      {
        colorIndex: 0,
        voxels: beforeSplit,
      },
    ]);
  });
  it('splits inconsequent', () => {
    const beforeSplit = [
      {
        x: 0,
        y: 0,
        z: 0,
        colorIndex: 0,
      },
      {
        x: 0,
        y: 0,
        z: 2, // inconsequent
        colorIndex: 0,
      },
      {
        x: 0,
        y: 0,
        z: 3,
        colorIndex: 1, // inconsequent
      },
      {
        x: 0,
        y: 0,
        z: 4,
        colorIndex: 1,
      },
    ];
    const split = greedy.splitRow(beforeSplit);
    expect(split).toHaveLength(3);
  });
});
