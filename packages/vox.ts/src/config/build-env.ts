declare const process: {
  env: {
    NODE_ENV: string;
  };
};

export const inBrowser = typeof window !== 'undefined';

export const isDevBuild = process.env.NODE_ENV !== 'production';
