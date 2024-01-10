import { isResSent } from 'next/dist/shared/lib/utils';
import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next/types';

export type HTTPMethod = Lowercase<'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'>;

class ApiError extends Error {
  constructor(
    readonly status: number,
    override readonly message: string,
  ) {
    super(message);
  }
}

export class RequestError extends ApiError {}

export class ServerError extends ApiError {}

export function buildHandler(children: Partial<Record<HTTPMethod, NextApiHandler>>): NextApiHandler {
  return async (req, res) => {
    const definedRoute = children[req.method?.toLowerCase() as HTTPMethod] as NextApiHandler | undefined;

    if (!definedRoute) {
      res.status(404).end();
      return;
    }

    try {
      const result = await definedRoute(req, res);

      if (isResSent(res)) {
        return;
      }

      // TODO: return result
    } catch (e) {
      if (isResSent(res)) {
        console.warn('Error thrown after headers sent', req.url, e);
        return;
      }

      if (e instanceof ApiError) {
        res.status(e.status).json({ message: e.message });
      } else {
        const msg = (e as any)?.message ?? `unknown error`;
        res.status(500).json({ message: msg });
      }
    }
  };
}
