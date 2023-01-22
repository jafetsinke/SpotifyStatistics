import { JWT } from "next-auth/jwt"

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const AUTHORIZATION = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

const getAccessToken = async (token: JWT) => {
  if (token.accessTokenExpires < Date.now()) {
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
    return response.json();
  }  
};

export const getUsersPlaylists = async (token: JWT) => {
  const {access_token} = await getAccessToken(token);
  return fetch("https://api.spotify.com/v1/me/playlists", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};

export const getUsersMostListened = async (type: "artists" | "tracks", token: JWT, limit: number, offset: number = 0, time_range: SpotifyTimeRange = "medium_term") => {
  const {access_token} = await getAccessToken(token);
  return fetch(`https://api.spotify.com/v1/me/top/${type}?limit=${limit}&offset=${offset}&time_range=${time_range}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};

export const getOwnSpotifyProfile = async (token: JWT) => {
  const {access_token} = await getAccessToken(token);
  return fetch("https://api.spotify.com/v1/me/", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};

// long_term (calculated from several years of data and including all new data as it becomes available),
// medium_term (approximately last 6 months),
// short_term (approximately last 4 weeks). Default: medium_term
export type SpotifyTimeRange = 'short_term' | 'medium_term' | 'long_term';