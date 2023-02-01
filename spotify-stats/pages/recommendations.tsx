import { useSession } from 'next-auth/react'
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Recommendations() {
  const { data: session } = useSession();

  const [recommendations, setRecommendations] = useState<any>(null);

  useEffect(() => {
    fetch('/api/spotify/recommendations')
      .then((res) => res.json())
      .then((recommendations) => {
        console.log(recommendations)
        setRecommendations(recommendations);
    });
  }, []);

  if (!session) {
    return (<h2>Not signed in. pls sign in :)</h2>)
  }

  if (!recommendations) {
    return (<h1>Loading...</h1>)
  }

  return (
    <>
      <h1>Recommendations</h1>
      <p><strong>Based on your 5 top tracks:</strong></p>
      {recommendations && recommendations.items.map((track: any) => (
        <p key={track.id}>{track.artists.map((artist: any) => artist.name).join(', ')} - {track.name}</p>
      ))}
      <div className="tableContainer">
        <table>
          <thead>
            <tr>
              <th>Track</th>
              <th>Artist</th>
              <th>Album</th>
              <th>Popularity</th>
              <th>Preview</th>
            </tr>
          </thead>
          <tbody>
            {recommendations && recommendations.tracks.map((track: any) => (
              <tr key={track.id}>
                <td><Link href={track.external_urls.spotify} target="_blank">{track.name}</Link></td>
                <td>{track.artists.map((artist: any) => artist.name).join(', ')}</td>
                <td>{track.album.name}</td>
                <td>{track.popularity}</td>
                <td>{trackPreview(track)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

function trackPreview(track: any) {
  if (!track.preview_url) {
    return "No preview available";
  } else {
    return (
      <audio controls src={track.preview_url}>Your browser does not support the audio element.</audio>
    )
  }
}