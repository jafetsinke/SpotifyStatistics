import {removeSongsFromLibrary} from '@/lib/spotify'
import {getSession} from 'next-auth/react';
import type { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({req});
  if (session === null) {
    return res.status(401).json({error: 'Unauthorized'});
  }

  if (!req.query.ids) {
    return res.status(400).json({error: 'Missing track ids'});
  }
  if (typeof req.query.ids === 'string') {
    req.query.ids = req.query.ids.split(',');
  }

  const response = await removeSongsFromLibrary(session.token, req.query.ids);

  return res.status(response.status).json({removed: req.query.ids});
};

export default handler;