import { NextApiHandler } from 'next';
import { URLSearchParams } from 'node:url';
import { serverRuntimeConfig } from '../../../src/config/runtime-config';
import { forwardApi, rebuildUri } from '../../../src/server/api-forwarder';

const catchAllHandler: NextApiHandler = async (req, res) => {
  const { pathSegments, ...rest } = req.query;
  try {
    const realUri = rebuildUri(
      pathSegments as string[],
      rest as Record<string, string | string[]>,
      serverRuntimeConfig.apiServerOrigin,
    );
    console.debug('realUri', realUri);
    await forwardApi(req, res, realUri);
  } catch (e: unknown) {
    console.error('catchAllHandler', e);
    if (!res.headersSent) {
      res.status(502).end();
    }
  }
};
export default catchAllHandler;
