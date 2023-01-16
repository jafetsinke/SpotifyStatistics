import {getUsersMostListened} from '@/lib/spotify'
import {getSession} from 'next-auth/react';
import type { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({req});
  const {type} = req.query;

  if (type !== 'artists' && type !== 'tracks') {
    return res.status(400).json({error: 'Invalid type'});
  }

  if (session === null) {
    return res.status(401).json({error: 'Unauthorized'});
  }

  const response = await getUsersMostListened(type, session.token.refreshToken, 50, 0, 'short_term');
  
  if (response.status !== 200) {
    return res.status(response.status).json({error: 'Failed to get top artists from Spotify'});
  }

  const {items} = await response.json();

  return res.status(200).json({items});
};

export default handler;