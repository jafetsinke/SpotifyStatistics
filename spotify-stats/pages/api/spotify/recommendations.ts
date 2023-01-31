import {getSession} from 'next-auth/react';
import type { NextApiRequest, NextApiResponse } from 'next'
import {getRecommendationsWithSeedTracks} from '@/lib/spotify';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({req});
  if (session === null) {
    return res.status(401).json({error: 'Unauthorized'});
  }

  if (!req.query.seedTracks) {
    return res.status(400).json({error: 'Missing track ids'});
  }

  if (typeof req.query.seedTracks === 'string') {
    req.query.seedTracks = req.query.seedTracks.split(',');
  }

  const response = await getRecommendationsWithSeedTracks(session.token, req.query.seedTracks);
  
  if (response.status !== 200) {
    return res.status(response.status).json({error: 'Failed to get recommendations: ' + response.statusText});
  }

  const responseJSON = await response.json();

  return res.status(200).json(responseJSON);
};

export default handler;