import { t } from './common/_base';
import { userRouter } from './routes/user';
import { modelsRouter } from './routes/model';

export const appRouter = t.router({
  user: userRouter,
  models: modelsRouter,
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
