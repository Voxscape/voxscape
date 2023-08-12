export interface TestResource<T> extends MutableTestResource<T> {
  value: T;
}

interface MutableTestResource<T> {
  value: T;
}

export function useTestResource<T>(allocator: () => Promise<T>, dealloc?: (t: T) => Promise<void>): TestResource<T> {
  const ref: MutableTestResource<T> = {
    value: null!,
  };

  beforeAll(async () => {
    ref.value = await allocator();
  });
  if (dealloc) {
    afterAll(async () => {
      await dealloc(ref.value);
    });
  }

  return ref;
}
