/* eslint @typescript-eslint/no-var-requires: 0 */
const { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_BUILD } = require('next/constants');

/**
 * when in problem, try to sync with {@link https://github.com/vercel/next.js/tree/canary/packages/create-next-app/templates/typescript}
 * @type {import('next').NextConfig}
 */
const nextConf = {
  poweredByHeader: false,

  /**
   * runtime server-only configuration
   * @type {import('./server/runtime-config').ServerRuntimeConfig}
   */
  serverRuntimeConfig: {
    serverStartAt: new Date().toISOString(),
  },
  /**
   * build-time configuration
   */
  env: {
    // becomes process.env.SOME_CONSTANT : boolean
    builtAt: new Date().toISOString(),
  },
  // see https://nextjs.org/docs/#customizing-webpack-config
  webpack(config, { buildId, dev, isServer, webpack }) {
    config.plugins.push(
      new webpack.DefinePlugin({
        /**
         * build-time configuration
         */
        'process.env.NEXT_DEV': JSON.stringify(!!dev),
      }),
    );

    config.node = {
      // allow use of __file / __dirname
      ...config.node,
      __filename: true,
    };
    return config;
  },

  transpilePackages: ['lodash-es', '@jokester/ts-commonutil', '@pwabuilder/pwainstall'],

  compiler: {
    emotion: true,
  },

  typescript: {
    ignoreBuildErrors: true, // required, we are not using emotion's jsx types
  },

  images: {},

  experimental: {
    webpackBuildWorker: true,
  },

  productionBrowserSourceMaps: true,
  reactStrictMode: true,
};

const UNUSED_rewrites = async () => {
  return {
    beforeFiles: [
      {
        source: '/api/nuthatch_v1/:path*',
        destination: `https://TODO/api/nuthatch_v1/:path*`,
      },
    ],
  };
};

module.exports = (phase, { defaultConfig }) => {
  /**
   * @type {import('next').NextConfig}
   */
  let merged = { ...nextConf };

  if (phase === PHASE_PRODUCTION_BUILD) {
    merged = require('@next/bundle-analyzer')({ enabled: true, openAnalyzer: false })(merged);
  }

  return merged;
};
