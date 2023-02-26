import { t } from './common/_base';
import { userRouter } from './routes/user';

export const appRouter = t.router({
  user: userRouter,
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
