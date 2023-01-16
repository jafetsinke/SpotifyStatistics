import {getUsersMostListened, SpotifyTimeRange} from '@/lib/spotify'
import {getSession} from 'next-auth/react';
import type { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({req});
  const {type} = req.query;
  let {limit = 10, offset = 0, time_range = 'medium_term'} = req.query;

  if (type !== 'artists' && type !== 'tracks') {
    return res.status(400).json({error: 'Invalid type'});
  }

  if (session === null) {
    return res.status(401).json({error: 'Unauthorized'});
  }

  // Convert limit and offset to numbers
  limit = limit !== undefined ? parseInt(limit as string) : limit;
  offset = offset !== undefined ? parseInt(offset as string) : offset;

  const response = await getUsersMostListened(type,session.token.refreshToken, limit, offset, time_range as SpotifyTimeRange);
  
  if (response.status !== 200) {
    return res.status(response.status).json({error: 'Failed to get top artists from Spotify: ' + response.statusText});
  }

  const {items} = await response.json();

  return res.status(200).json({items});
};

export default handler;