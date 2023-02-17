import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { artistsLinks } from '@/components/Top';
import { averageOfKeyInArray } from '@/lib/utils';
import { SpotifyAudioFeatures, SpotifyTrack } from '@/lib/spotify';

export default function TopTracksStats() {
  const { data: session } = useSession()

  const [tracks, setTracks] = useState<any>(null);

  useEffect(() => {
    fetch('/api/spotify/me/top/tracks')
      .then((res) => res.json())
      .then((tracks) => {
        setTracks(tracks.items);

        const trackIds = tracks.items.map((track: SpotifyTrack) => track.id);
        fetch('/api/spotify/audio-features?id=' + trackIds.join(','))
          .then((res) => res.json())
          .then((audioFeatures) => {
              let i = 0;
              const tracksWithAudioFeatures = tracks.items.map((track: SpotifyTrack) => {
                const features = audioFeatures[i];
                i++;
                return {...track , audio_features: features};
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

  const audioFeaturesArray: SpotifyAudioFeatures[] = tracks.map((track: SpotifyTrack) => track.audio_features);
  return (
    <>
      <p><strong>average danceability:</strong> {averageOfKeyInArray("danceability", audioFeaturesArray)}</p>
      <p><strong>average energy:</strong> {averageOfKeyInArray("energy", audioFeaturesArray)}</p>
      <p><strong>average key:</strong> {averageOfKeyInArray("key", audioFeaturesArray)}</p>
      <p><strong>average loudness:</strong> {averageOfKeyInArray("loudness", audioFeaturesArray)}</p>
      <p><strong>average mode:</strong> {averageOfKeyInArray("mode", audioFeaturesArray)}</p>
      <p><strong>average speechiness:</strong> {averageOfKeyInArray("speechiness", audioFeaturesArray)}</p>
      <p><strong>average acousticness:</strong> {averageOfKeyInArray("acousticness", audioFeaturesArray)}</p>
      <p><strong>average instrumentalness:</strong> {averageOfKeyInArray("instrumentalness", audioFeaturesArray)}</p>
      <p><strong>average liveness:</strong> {averageOfKeyInArray("liveness", audioFeaturesArray)}</p>
      <p><strong>average valence:</strong> {averageOfKeyInArray("valence", audioFeaturesArray)}</p>
      <p><strong>average tempo:</strong> {averageOfKeyInArray("tempo", audioFeaturesArray)}</p>
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
            {tracks.map((track: SpotifyTrack) => (
              <tr key={track.id}>
                <td>{track.name}</td>
                <td>{artistsLinks(track.artists)}</td>
                <td><Link href={track.album.external_urls.spotify} target="_blank">{track.album.name}</Link></td>
                <td>{track.album.release_date}</td>
                <td>{track.popularity}</td>
                <td>{track.album.album_type}</td>
                <td>{track.id}</td>
                <td>{track.audio_features?.danceability}</td>
                <td>{track.audio_features?.energy}</td>
                <td>{track.audio_features?.key}</td>
                <td>{track.audio_features?.loudness}</td>
                <td>{track.audio_features?.mode}</td>
                <td>{track.audio_features?.speechiness}</td>
                <td>{track.audio_features?.acousticness}</td>
                <td>{track.audio_features?.instrumentalness}</td>
                <td>{track.audio_features?.liveness}</td>
                <td>{track.audio_features?.valence}</td>
                <td>{track.audio_features?.tempo}</td>
                <td>{track.audio_features?.time_signature}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
