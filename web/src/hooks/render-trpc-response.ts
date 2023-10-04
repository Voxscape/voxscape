import type { UseTRPCQueryResult } from '@trpc/react-query/src/shared/hooks/types';
import type { TRPCClientErrorLike } from '@trpc/client';
import { AnyProcedure, AnyRouter } from '@trpc/server';
import { TRPCErrorShape } from '@trpc/server/rpc';
import { ReactChild, ReactElement, ReactText } from 'react';

interface ExtraOptions {
  renderLoading?: () => null | undefined | ReactText | ReactElement;
  renderError?: (e: TRPCClientErrorLike<any>) => null | undefined | ReactText | ReactElement;
}
const defaultExtra: ExtraOptions = {
  renderLoading: () => 'loading',
  renderError: (e) => e.message,
};

export function useRenderTrpcQuery<TData, TProcedure extends AnyProcedure | AnyRouter | TRPCErrorShape<number>>(
  queried: UseTRPCQueryResult<TData, TRPCClientErrorLike<TProcedure>>,
  render: (data: TData) => ReactElement,
  extra: ExtraOptions = defaultExtra,
): null | undefined | ReactElement | ReactText {
  if (queried.data) {
    return render(queried.data);
  } else if (queried.error) {
    return extra?.renderError?.(queried.error);
  } else {
    return extra?.renderLoading?.();
  }
}
