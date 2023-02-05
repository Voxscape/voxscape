import { NextApiHandler } from 'next';
import { buildHandler } from '../../../../src/server/next_api_builder';

/**
 * GET /api/vox/models
 */
const get: NextApiHandler = async (req, res) => {
  const recentModels: unknown[] = [];

  return { recentModels };
};

/**
 * POST /api/vox/models
 */
const post: NextApiHandler = async (req, res) => {};

export default buildHandler({ get, post });
