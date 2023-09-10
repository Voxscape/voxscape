import type { NextApiRequest, NextApiResponse } from 'next/types';
import { createDebugLogger } from '../shared/logger';
import type { NextFetchEvent, NextRequest } from 'next/server';
import { NextApiHandler } from 'next';

const logger = createDebugLogger(__filename);

/**
 *
 * @param req
 * @param ev
 */
export function logHttpRequest(req: NextRequest, ev: NextFetchEvent) {
  logger(req.method, req.url);
}

/**
 * For API request we can measure its delay by re
 * @param req
 * @param res
 */
function logApiRequest(req: NextApiRequest, res: NextApiResponse) {
  const start = Date.now();
  req.once('close', () => {
    logger('request finish', req.url, Date.now() - start);
  });
  res.once('close', () => {
    logger('response finish', req.url, Date.now() - start);
  });
}

export function withApiRequestLog(handler: NextApiHandler): NextApiHandler {
  return (req: NextApiRequest, res: NextApiResponse) => {
    logApiRequest(req, res);
    return handler(req, res);
  };
}
