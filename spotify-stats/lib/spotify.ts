const clientID = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const authorization = Buffer.from(`${clientID}:${clientSecret}`).toString('base64');

const getAccessToken = async (refresh_token: string) => {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: 'POST',
    headers: {
      Authorization: `Basic ${authorization}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token,
    }),
  });

  return response.json();
};

export const getUsersPlaylists = async (refresh_token: string) => {
  const {access_token} = await getAccessToken(refresh_token);
  return fetch("https://api.spotify.com/v1/me/playlists", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};

export const getUsersMostListened = async (type: "artists" | "tracks", refresh_token: string, limit: number, offset: number = 0, time_range: SpotifyTimeRange = "medium_term") => {
  const {access_token} = await getAccessToken(refresh_token);
  return fetch(`https://api.spotify.com/v1/me/top/${type}?limit=${limit}&offset=${offset}&time_range=${time_range}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};

// long_term (calculated from several years of data and including all new data as it becomes available),
// medium_term (approximately last 6 months),
// short_term (approximately last 4 weeks). Default: medium_term
type SpotifyTimeRange = 'short_term' | 'medium_term' | 'long_term';