import {getUsersMostListened, SpotifyTimeRange} from '@/lib/spotify'
import {getSession} from 'next-auth/react';
import type { NextApiRequest, NextApiResponse } from 'next'

function toInt(str: string | string[]): number {
  return parseInt(typeof str === 'string' ? str : str[0]);
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({req});
  if (session === null) {
    return res.status(401).json({error: 'Unauthorized'});
  }
  //TODO: type must be artist/tracks enum
  const {type, limitStr = '10', offsetStr = '0', time_range = 'medium_term'} = req.query;

  if (type !== 'artists' && type !== 'tracks') {
    return res.status(400).json({error: 'Invalid type'});
  }

  const limit = toInt(limitStr);
  const offset = toInt(offsetStr);

  const response = await getUsersMostListened(type, session.token.refreshToken, limit, offset, time_range as SpotifyTimeRange);
  
  if (response.status !== 200) {
    return res.status(response.status).json({error: 'Failed to get top artists from Spotify: ' + response.statusText});
  }

  const {items} = await response.json();

  return res.status(200).json({items});
};

export default handler;