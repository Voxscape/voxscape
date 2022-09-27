const buildConfig = {
  builtAt: process.env.builtAt,
  NEXT_DEV: process.env.NEXT_DEV,
} as const;

export const isDevBuild = !!process.env.NEXT_DEV;
export const inBrowser = typeof window !== 'undefined';
export const inServer = !inBrowser;

console.debug(
  `buildConfig as seen from ${isDevBuild ? 'dev' : 'prod'} / ${inServer ? 'server' : 'client'}`,
  buildConfig,
);
