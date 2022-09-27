/* eslint @typescript-eslint/no-var-requires: 0 */
const { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_BUILD } = require('next/constants');
/**
 * when in problem, try to sync with {@link https://github.com/vercel/next.js/tree/canary/packages/create-next-app/templates/typescript}
 * @type {import('next').NextConfig}
 */
const nextConf = {
  poweredByHeader: false,

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
  reactStrictMode: true,
};

module.exports = (phase, { defaultConfig }) => {
  /**
   * @type {import('next').NextConfig}
   */
  let merged = { ...nextConf };

  if (phase === PHASE_PRODUCTION_BUILD) {
    merged = require('@next/bundle-analyzer')({ enabled: true, openAnalyzer: false })(merged);
  }

  merged = require('next-transpile-modules')(['lodash-es', '@jokester/ts-commonutil'])(merged);

  return merged;
};
