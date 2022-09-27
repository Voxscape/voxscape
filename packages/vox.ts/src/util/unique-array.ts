export class UniqueArray<T> {
  private readonly _elems: T[] = [];
  private readonly indexes = new Map<string | number, number>();

  constructor(private readonly identify: (t: T) => /* primitive*/ string | number) {}

  has(t: T) {
    return this.indexes.has(this.identify(t));
  }

  indexOf(t: T) {
    return this.indexes.get(this.identify(t)) ?? -1;
  }

  add(t: T) {
    const id = this.identify(t);
    const existingIndex = this.indexes.get(id) ?? -1;
    if (existingIndex >= 0) {
      return existingIndex;
    } else {
      this._elems.push(t);
      this.indexes.set(id, this._elems.length - 1);
      return this._elems.length - 1;
    }
  }

  elems(): readonly T[] {
    return this._elems.slice();
  }
}
