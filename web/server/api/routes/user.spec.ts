import { useMockUser } from '../../../test/test-util/mock-user';
import { userRouter } from './user';
import { ClientBad } from '../errors';

describe('routes/user', () => {
  describe('for unauthenticated user', () => {
    it('allows list of user', async () => {
      const res = await userRouter.createCaller({}).list({});
      expect(res.users).toBeInstanceOf(Array);
    });
    it('forbids use of x', async () => {
      const res = userRouter.createCaller({}).getOwnProfile();
      await expect(res).rejects.toBeInstanceOf(ClientBad);
      await expect(res).rejects.toEqual(
        expect.objectContaining({
          message: 'not logged in',
          code: 'UNAUTHORIZED',
        }),
      );
    });
  });

  describe('for authenticated user', () => {
    const mockUser = useMockUser();

    it('allows authorized to get self', async () => {
      const ownProfile = await userRouter
        .createCaller({ session: { user: mockUser.value, expires: '2099-01-01' } })
        .getOwnProfile();
      expect(ownProfile.id).toEqual(mockUser.value.id);
    });

    it('forbids expired session', async () => {
      const ownProfile = userRouter
        .createCaller({ session: { user: mockUser.value, expires: '1999-01-01' } })
        .getOwnProfile();
      await expect(ownProfile).rejects.toBeInstanceOf(ClientBad);
      await expect(ownProfile).rejects.toEqual(
        expect.objectContaining({
          message: 'session expired',
          code: 'UNAUTHORIZED',
        }),
      );
    });

    it('forbids invalid session', async () => {
      const ownProfile = userRouter
        .createCaller({ session: { user: mockUser.value, expires: undefined! } })
        .getOwnProfile();
      await expect(ownProfile).rejects.toBeInstanceOf(ClientBad);
      await expect(ownProfile).rejects.toEqual(
        expect.objectContaining({
          message: 'session expired',
          code: 'UNAUTHORIZED',
        }),
      );
    });
  });
});
