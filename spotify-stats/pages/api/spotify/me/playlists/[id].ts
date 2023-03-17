import {getPlaylist} from '@/lib/spotify'
import {getSession} from 'next-auth/react';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({req});
  if (session === null) {
    return res.status(401).json({error: 'Unauthorized'});
  }

  const id = req.query.id;

  if (!id) {
    return res.status(400).json({error: 'Missing playlist id'});
  } else if (typeof id !== 'string') {
    return res.status(400).json({error: 'Playlist id must be a single string'});
  }

  const response = await getPlaylist(session.token, id);
  const items = await response.json();

  return res.status(200).json(items);
};

export default handler;