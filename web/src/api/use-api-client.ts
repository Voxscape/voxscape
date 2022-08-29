import { DefaultApi } from './openapi';
import { inServer } from '../config/build-config';
import { Never } from '@jokester/ts-commonutil/lib/concurrency/timing';
import { useMemo } from 'react';

class ApiFacade {
  private readonly apiLoaded: Promise<DefaultApi>;

  constructor(basePath: string) {
    this.apiLoaded = inServer
      ? Never
      : import('./openapi/index').then((imported) => new imported.DefaultApi(new imported.Configuration({ basePath })));
  }

  async useApi<T>(consumer: (api: DefaultApi) => Promise<T>): Promise<T> {
    return this.apiLoaded.then(consumer);
  }
}

export function useApiClient(): ApiFacade {
  return useMemo(() => new ApiFacade('/api/nuthatch_v1'), []);
}
