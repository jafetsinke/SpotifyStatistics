import {getSession} from 'next-auth/react';
import type { NextApiRequest, NextApiResponse } from 'next'
import {getRecommendationsWithSeedTracks, getTracksAudioFeatures, getUsersMostListened} from '@/lib/spotify';
import { randomNum } from '@/lib/utils';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({req});
  if (session === null) {
    return res.status(401).json({error: 'Unauthorized'});
  }

  const boldness = req.query.boldness || 50;

  const topTracks = await getUsersMostListened('tracks', session.token, 50, 0, "short_term");
  const topTracksJSON = await topTracks.json();
  const trackIds = topTracksJSON.items.map((track: any) => track.id);
  const topTracksAudioFeatures = await getTracksAudioFeatures(session.token, trackIds);
  const topTracksAudioFeaturesJSON = await topTracksAudioFeatures.json();

  const targetValues = getValuesFromBoldness(Number(boldness), topTracksAudioFeaturesJSON.audio_features);
  
  const response = await getRecommendationsWithSeedTracks(session.token, trackIds.splice(0, 5), targetValues);
  
  if (response.status !== 200) {
    return res.status(response.status).json({error: 'Failed to get recommendations: ' + response.statusText});
  }

  const responseJSON = await response.json();

  return res.status(200).json({targetValues, ...responseJSON, ...topTracksJSON});
};

const getValuesFromBoldness = (boldness: number, features: any) => {
  
  const audioFeatureArrays = getAudioFeatureArrays(features);

  const values: any = {
    acousticness: 0.5,
    danceability: 0.5,
    energy: 0.5,
    valence: 0.5,
  };

  for (let feature in values) {
    // using the median as the starting value
    const median = getMedian(audioFeatureArrays[feature]);
    const roundedMedian = Number(median.toFixed(6));

    // get the difference between the median and the upper and lower bounds
    const diffUp = Number((1 - roundedMedian).toFixed(6));
    const diffDown = Number((0.00001 - roundedMedian).toFixed(6));

    // get the smallest diff when boldness is below 33, otherwise get the largest diff
    let diff = 0;
    if (boldness <= 33) {
      diff = diffUp < -diffDown ? diffUp : diffDown;
    } else {
      diff = diffUp > -diffDown ? diffUp : diffDown;
    }

    // converting boldness (1-100) to a multiplier (0.01-1)
    const boldnessMultiplier = boldness / 100;

    // define a range in which the random value will be generated
    // higher boldness will mean random values in a range farther from the median
    // higher range size means values will be more random
    const rangeSize = 0.5;
    const rangeMod = rangeSize * boldnessMultiplier;
    const rangeMin = roundedMedian + (diff * rangeMod);
    const rangeMax = rangeMin + (diff * rangeMod);

    // get a random value between the median and the upper or lower bound
    const randomValue = randomNum(rangeMin, rangeMax);

    values[feature] = Number(randomValue.toFixed(6));
  }

  // TODO: improve popularity calculation
  values.popularity = Math.floor(randomNum(0, (100 - boldness)));

  return values;
}

const getAudioFeatureArrays = (features: any[]) => {
  let audioFeatureArrays: any = {
    acousticness: [],
    danceability: [],
    energy: [],
    valence: [],
  };
  
  for (let i = 0; i < features.length; i++) {
    for (let feature in audioFeatureArrays) {
      audioFeatureArrays[feature].push(features[i][feature]);
    }
  }
  
  return audioFeatureArrays;
}

const getMedian = (values: number[]) => {
  const sorted = values.sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2) {
    return sorted[middle];
  }

  return (sorted[middle - 1] + sorted[middle]) / 2;
}

export default handler;