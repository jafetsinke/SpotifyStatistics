import { JWT } from "next-auth/jwt"

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const AUTHORIZATION = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

const getAccessToken = async (token: JWT) => {
  if (token.accessTokenExpires > Date.now()) {
    return token.accessToken;
  } else {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: 'POST',
      headers: {
        Authorization: `Basic ${AUTHORIZATION}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken,
      }),
    });
    const res = await response.json();
    return res.access_token;
  }  
};

export const getUsersPlaylists = async (token: JWT) => {
  const accessToken = await getAccessToken(token);
  return fetch("https://api.spotify.com/v1/me/playlists", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const getUsersMostListened = async (type: SpotifyTopItemsType, token: JWT, limit: number, offset: number = 0, time_range: SpotifyTimeRange = "medium_term") => {
  const accessToken = await getAccessToken(token);
  return fetch(`https://api.spotify.com/v1/me/top/${type}?limit=${limit}&offset=${offset}&time_range=${time_range}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const getOwnSpotifyProfile = async (token: JWT) => {
  const accessToken = await getAccessToken(token);
  return fetch("https://api.spotify.com/v1/me/", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const getTracksAudioFeatures = async (token: JWT, trackId: string[]) => {
  const accessToken = await getAccessToken(token);

  // Spotify API only allows 100 tracks per request so we only send the first 100
  if (trackId.length > 100) {
    trackId = trackId.slice(0, 100);
  }

  if (trackId.length > 1) {
    return fetch(`https://api.spotify.com/v1/audio-features?ids=${trackId.join(",")}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } else {
    return fetch(`https://api.spotify.com/v1/audio-features/${trackId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }
};

export const getRecommendationsWithSeedTracks = async (token: JWT, seedTracks: string[], targets: any) => {
  const accessToken = await getAccessToken(token);

  if (seedTracks.length > 5) {
    seedTracks = seedTracks.slice(0, 5);
  }

  const targetString = Object.keys(targets).map((key) => `target_${key}=${targets[key]}`).join("&");

  return fetch(`https://api.spotify.com/v1/recommendations?seed_tracks=${seedTracks.join(",")}&` + targetString, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const saveSongsToLibrary = async (token: JWT, trackIds: string[]) => {
  const accessToken = await getAccessToken(token);

  return fetch(`https://api.spotify.com/v1/me/tracks?ids=${trackIds.join(",")}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const removeSongsFromLibrary = async (token: JWT, trackIds: string[]) => {
  const accessToken = await getAccessToken(token);

  return fetch(`https://api.spotify.com/v1/me/tracks?ids=${trackIds.join(",")}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export interface SpotifyTrack {
  name: string,
  artists: SpotifyArtist[],
  id: string,
  album: SpotifyAlbum,
  explicit: boolean,
  external_urls: {
    spotify: string
  },
  href: string,
  duration_ms: number,
  popularity: number,
  preview_url: string,
  audio_features: SpotifyAudioFeatures
}

export interface SpotifyAlbum {
  name: string,
  artists: SpotifyArtist[],
  id: string,
  album_type: SpotifyAlbumType,
  external_urls: {
    spotify: string
  },
  href: string,
  images: SpotifyImage[],
  release_date: string,
  genres: string[],
  popularity: number,
}

export interface SpotifyArtist {
  name: string,
  id: string,
  external_urls: {
    spotify: string
  },
  followers: {
    total: number
  },
  genres: string[],
  href: string,
  images: SpotifyImage[],
  popularity: number
}

export interface SpotifyImage {
  url: string,
  width: number,
  height: number
}

export interface SpotifyAudioFeatures {
  acousticness: number,
  danceability: number,
  energy: number,
  instrumentalness: number,
  key: number,
  liveness: number,
  loudness: number,
  mode: number,
  speechiness: number,
  tempo: number,
  time_signature: number,
  valence: number,
}

// long_term (calculated from several years of data and including all new data as it becomes available),
// medium_term (approximately last 6 months),
// short_term (approximately last 4 weeks). Default: medium_term
export type SpotifyTimeRange = 'short_term' | 'medium_term' | 'long_term';
export type SpotifyTopItemsType = 'artists' | 'tracks';
export type SpotifyAlbumType = 'ALBUM' | 'SINGLE' | 'COMPILATION';