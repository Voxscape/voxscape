import { useMockUser } from './mock-user';

describe('mock-user', () => {
  describe('without option', () => {
    const user = useMockUser();

    it('allocates user', async () => {
      expect(user.value).toBeTruthy();
      expect(typeof user.value.id).toBe('string');
      expect(user.value.emailVerified).toBe(null);
    });
  });

  describe('with option', () => {
    const user = useMockUser({ emailVerified: true });

    it('allocates user', async () => {
      expect(user.value).toBeTruthy();
      expect(user.value.emailVerified).toBeInstanceOf(Date);
    });
  });
});
