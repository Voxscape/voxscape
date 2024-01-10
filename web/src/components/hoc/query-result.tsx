import { UseTRPCQueryResult } from '@trpc/react-query/src/shared/hooks/types';
import { ReactElement } from 'react';
import { Spinner } from '@chakra-ui/react';

// a simpler type this is assignable from UseTRPCQueryResult
interface TrpcQueryResultSink<T> {
  isFetching?: boolean;
  isError?: boolean;
  data?: T;
}

export function QueryResult<T>({
  value,
  showLoading,
  children: renderData,
}: {
  value: TrpcQueryResultSink<T>;
  showLoading?: boolean;
  children(loaded: T): ReactElement;
}): null | ReactElement {
  if (value.isFetching) {
    if (showLoading ?? true) {
      return <Spinner />;
    } else {
      return null;
    }
  }

  if (value.isError) {
    return null;
  }

  if (value.data) {
    return renderData(value.data);
  }

  return null;
}
