import { t } from './common/_base';
import { userRouter } from './routes/user';
import { modelRouter } from './routes/model';
import { uploadRouter } from './routes/upload/upload';

export const appRouter = t.router({
  user: userRouter,
  models: modelRouter,
  upload: uploadRouter,
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
