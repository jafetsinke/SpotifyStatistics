import {getSession} from 'next-auth/react';
import type { NextApiRequest, NextApiResponse } from 'next'
import {getRecommendationsWithSeedTracks, getUsersMostListened} from '@/lib/spotify';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({req});
  if (session === null) {
    return res.status(401).json({error: 'Unauthorized'});
  }

  const topTracks = await getUsersMostListened('tracks', session.token, 5);
  const topTracksJSON = await topTracks.json();
  const trackIds = topTracksJSON.items.map((track: any) => track.id);
  
  const response = await getRecommendationsWithSeedTracks(session.token, trackIds);
  
  if (response.status !== 200) {
    return res.status(response.status).json({error: 'Failed to get recommendations: ' + response.statusText});
  }

  const responseJSON = await response.json();

  return res.status(200).json({...responseJSON, ...topTracksJSON});
};

export default handler;