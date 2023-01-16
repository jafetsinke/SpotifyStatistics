import {getUsersPlaylists} from '@/lib/spotify'
import {getSession} from 'next-auth/react';
import type { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({req});
  if (session === null) {
    return res.status(401).json({error: 'Unauthorized'});
  }

  const refreshToken = session.token.refreshToken;
  const response = await getUsersPlaylists(refreshToken);
  const {items} = await response.json();

  return res.status(200).json({items});
};

export default handler;