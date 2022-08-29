import getConfig from 'next/config';

interface ServerRuntimeConfig {
  serverStartAt: string;
  apiServerOrigin: string;
}
export const serverRuntimeConfig: ServerRuntimeConfig = getConfig().serverRuntimeConfig;
