import getConfig from 'next/config';
import { createDebugLogger } from '../../shared/logger';
const debugLogger = createDebugLogger(__filename);

interface PublicRuntimeConfig {}
export const publicRuntimeConfig: PublicRuntimeConfig = getConfig().publicRuntimeConfig;
export const inBrowser = typeof window !== 'undefined';
export const inServer = !inBrowser;

debugLogger('publicRuntimeConfig', publicRuntimeConfig);
