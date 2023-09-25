import type { UseTRPCQueryResult } from '@trpc/react-query/src/shared/hooks/types';
import type { TRPCClientErrorLike } from '@trpc/client';
import { AnyProcedure, AnyRouter } from '@trpc/server';
import { TRPCErrorShape } from '@trpc/server/rpc';
import { ReactElement } from 'react';

export function useRenderTrpcQuery<TData, TProcedure extends AnyProcedure | AnyRouter | TRPCErrorShape<number>>(
  queried: UseTRPCQueryResult<TData, TRPCClientErrorLike<TProcedure>>,
  render: (data: TData) => ReactElement,
): ReactElement | string {
  if (queried.data) {
    return render(queried.data);
  } else if (queried.error) {
    return queried.error.message;
  } else {
    return 'loading';
  }
}
