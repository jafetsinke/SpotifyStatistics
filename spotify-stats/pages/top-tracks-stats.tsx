import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { artistsLinks } from '@/components/Top';

export default function TopTracksStats() {
  const { data: session } = useSession()

  const [tracks, setTracks] = useState<any>(null);

  useEffect(() => {
    fetch('/api/spotify/me/top/tracks')
      .then((res) => res.json())
      .then((tracks) => {
        setTracks(tracks.items);

        const trackIds = tracks.items.map((track: any) => track.id);
        fetch('/api/spotify/audio-features?id=' + trackIds.join(','))
          .then((res) => res.json())
          .then((audioFeatures) => {
              let i = 0;
              const tracksWithAudioFeatures = tracks.items.map((track: any) => {
                const trackWithAudioFeatures = {...track, ...audioFeatures[i]};
                i++;
                return trackWithAudioFeatures;
              });
              setTracks(tracksWithAudioFeatures); 
          });
      });
  }, []);

  if (!session) {
    return (<h2>Not signed in. pls sign in :)</h2>)
  }

  if (!tracks) {
    return (<h1>Loading...</h1>)
  }

  return (
    <>
      <p><strong>average danceability:</strong> {averageOfKeyInArray("danceability", tracks)}</p>
      <p><strong>average energy:</strong> {averageOfKeyInArray("energy", tracks)}</p>
      <p><strong>average key:</strong> {averageOfKeyInArray("key", tracks)}</p>
      <p><strong>average loudness:</strong> {averageOfKeyInArray("loudness", tracks)}</p>
      <p><strong>average mode:</strong> {averageOfKeyInArray("mode", tracks)}</p>
      <p><strong>average speechiness:</strong> {averageOfKeyInArray("speechiness", tracks)}</p>
      <p><strong>average acousticness:</strong> {averageOfKeyInArray("acousticness", tracks)}</p>
      <p><strong>average instrumentalness:</strong> {averageOfKeyInArray("instrumentalness", tracks)}</p>
      <p><strong>average liveness:</strong> {averageOfKeyInArray("liveness", tracks)}</p>
      <p><strong>average valence:</strong> {averageOfKeyInArray("valence", tracks)}</p>
      <p><strong>average tempo:</strong> {averageOfKeyInArray("tempo", tracks)}</p>
      <div className="tableContainer">
        <table>
          <thead>
            <tr>
              <th>Track</th>
              <th>Artist</th>
              <th>Album</th>
              <th>Release Date</th>
              <th>Popularity</th>
              <th>Type</th>
              <th>id</th>
              <th>danceability</th>
              <th>energy</th>
              <th>key</th>
              <th>loudness</th>
              <th>mode</th>
              <th>speechiness</th>
              <th>acousticness</th>
              <th>instrumentalness</th>
              <th>liveness</th>
              <th>valence</th>
              <th>tempo</th>
              <th>time_signature</th>
            </tr>
          </thead>
          <tbody>
            {tracks.map((track: any) => (
              <tr key={track.id}>
                <td>{track.name}</td>
                <td>{artistsLinks(track.artists)}</td>
                <td><Link href={track.album.external_urls.spotify} target="_blank">{track.album.name}</Link></td>
                <td>{track.album.release_date}</td>
                <td>{track.popularity}</td>
                <td>{track.album.album_type}</td>
                <td>{track.id}</td>
                <td>{track.danceability}</td>
                <td>{track.energy}</td>
                <td>{track.key}</td>
                <td>{track.loudness}</td>
                <td>{track.mode}</td>
                <td>{track.speechiness}</td>
                <td>{track.acousticness}</td>
                <td>{track.instrumentalness}</td>
                <td>{track.liveness}</td>
                <td>{track.valence}</td>
                <td>{track.tempo}</td>
                <td>{track.time_signature}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

function averageOfKeyInArray(key: string, array: any[]) {
  const average = array.reduce((total, next) => total + next[key], 0)/ array.length;
  return isNaN(average) ? "N/A" : average;
}
