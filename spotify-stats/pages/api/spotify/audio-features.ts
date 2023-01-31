import {getSession} from 'next-auth/react';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getTracksAudioFeatures } from '@/lib/spotify';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({req});
  if (session === null) {
    return res.status(401).json({error: 'Unauthorized'});
  }

  if (!req.query.id) {
    return res.status(400).json({error: 'Missing track ids'});
  }

  if (typeof req.query.id === 'string') {
    req.query.id = req.query.id.split(',');
  }

  const response = await getTracksAudioFeatures(session.token, req.query.id);
  
  if (response.status !== 200) {
    return res.status(response.status).json({error: 'Failed to get audio features: ' + response.statusText});
  }

  const responseJSON = await response.json();

  if (responseJSON.audio_features !== undefined) {
    return res.status(200).json(responseJSON.audio_features);
  } else {
    return res.status(200).json([responseJSON]);
  }
};

export default handler;