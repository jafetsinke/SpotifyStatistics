import {getSession} from 'next-auth/react';
import type { NextApiRequest, NextApiResponse } from 'next'
import {getRecommendationsWithSeedTracks, getTracksAudioFeatures, getUsersMostListened} from '@/lib/spotify';
import { randomNum } from '@/lib/utils';
import { medianOfKeyInArray } from '@/lib/utils';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({req});
  if (session === null) {
    return res.status(401).json({error: 'Unauthorized'});
  }

  const boldness = req.query.boldness || 50;
  const boldnessMultiplier = Number(boldness) / 100;

  if (boldness < 0 || boldness > 100) {
    return res.status(400).json({error: 'Boldness out of range: must be between 0 and 100'});
  }

  const topTracks = await getUsersMostListened('tracks', session.token, 50, 0, "medium_term");
  const topTracksJSON = await topTracks.json();
  const trackIds = topTracksJSON.items.map((track: any) => track.id);

  // get seed tracks
  // higher boldness means less tracks used for seed, boldness=100 > 1 track, boldness=0 > 4 tracks
  // higher boldness will use tracks lower in the top listened list
  const seedTrackOffset = Math.round(randomNum(1, 5 * boldnessMultiplier));
  const seedTracksPos = Math.round(boldnessMultiplier * 40);
  const seedTracksAmount = (4 * (1 - boldnessMultiplier)) + 1;
  const seedTracks = trackIds.splice(seedTracksPos + seedTrackOffset, seedTracksAmount);
  
  const topTracksAudioFeatures = await getTracksAudioFeatures(session.token, trackIds);
  const topTracksAudioFeaturesJSON = await topTracksAudioFeatures.json();
  const targetFeatures = getFeaturesWithBoldness(Number(boldness), topTracksAudioFeaturesJSON.audio_features);

  // when boldness is above 50 we will start using the popularity to get recommendations
  if (boldnessMultiplier >= 0.5) {
    const medianPopularity = medianOfKeyInArray('popularity', topTracksJSON.items);
    const popularityLower = medianPopularity * (1 - boldnessMultiplier);
    const popularityUpper = medianPopularity - (Math.pow(boldnessMultiplier, 2) * 0.75 * medianPopularity);
    targetFeatures.popularity = Math.round(randomNum(popularityLower, popularityUpper));
  }

  const response = await getRecommendationsWithSeedTracks(session.token, seedTracks, targetFeatures);
  
  if (response.status !== 200) {
    return res.status(response.status).json({error: 'Failed to get recommendations: ' + response.statusText});
  }

  const responseJSON = await response.json();

  return res.status(200).json({targetFeatures, ...responseJSON});
};

const getFeaturesWithBoldness = (boldness: number, features: any) => {

  const featuresToUse = ['acousticness', 'danceability', 'valence'];
  const values: any = {};

  for (const feature of featuresToUse) {
    // using the median as the starting value
    const median = medianOfKeyInArray(feature, features);
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

  return values;
}

export default handler;