import getConfig from 'next/config';
interface ServerRuntimeConfig {
  serverStartAt: string;
  apiServerOrigin: string;
}
export const serverRuntimeConfig: ServerRuntimeConfig = getConfig().serverRuntimeConfig;
export const inBrowser = typeof window !== 'undefined';
export const inServer = !inBrowser;

console.debug('serverRuntimeConfig', serverRuntimeConfig);
