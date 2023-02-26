import { initTRPC } from '@trpc/server';
import { TrpcReqContext } from './auth';

export const t = initTRPC.context<TrpcReqContext>().create();
