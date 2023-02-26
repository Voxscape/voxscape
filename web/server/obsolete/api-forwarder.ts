import { NextApiRequest, NextApiResponse } from 'next';
import { URLSearchParams } from 'node:url';

export function rebuildUri(
  pathSegments: string[],
  restQuery: Record<string, string | string[]>,
  upstream: string,
): string {
  const query = new URLSearchParams(restQuery as Record<string, string | string[]>);

  let upstreamUri = upstream + `/${pathSegments.join('/')}`;

  const queryStr = query.toString();
  if (queryStr) {
    upstreamUri += queryStr;
  }
  return upstreamUri;
}

export async function forwardApi(req: NextApiRequest, res: NextApiResponse, realUri: string): Promise<void> {
  const upstreamRes = await fetch(realUri, {
    headers: req.headers as HeadersInit,
    method: req.method,
    body: req.body,
  });
  const resBody = upstreamRes.body;
  res.status(upstreamRes.status);
  for (const [h, v] of upstreamRes.headers) {
    res.setHeader(h, v);
  }
  res.send(resBody);
}
