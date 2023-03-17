import ProtectedRoute from '@/components/ProtectedRoute';
import { SpotifyPlaylist } from '@/lib/spotify';
import { useEffect, useState } from 'react';
import { getImageURLWithTargetResolution } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';


export default function PlaylistBuilderAll() {

  const [playlists, setPlaylists] = useState<any[]>([]);


  useEffect(() => {
    fetch(`api/spotify/me/playlists`)
      .then((res) => res.json())
      .then((data) => {
        setPlaylists(data.items);
      });
  }, []);

  if (playlists.length === 0) {
    return (
      <p>loading...</p>
    )
  }

  return (
    <ProtectedRoute>
      <h1>Playlist Builder</h1>
      {playlists.map((playlist: SpotifyPlaylist) => {
        return <PlaylistCard playlist={playlist} key={playlist.id} />
      })}
    </ProtectedRoute>
  )
}

const PlaylistCard = (props: {playlist: SpotifyPlaylist}) => {
  const { playlist } = props;
  return (
    <div className="card">
      <Image src={getImageURLWithTargetResolution(playlist.images, 256)} alt={playlist.name + " Spotify album cover"} width="256" height="256"></Image>
      <p><strong>{playlist.name}</strong></p>
      <p>{playlist.description}</p>
      <p>Tracks: <strong>{playlist.tracks.total}</strong></p>
      <Link href={playlist.external_urls.spotify} target="_blank">View playlist on Spotify</Link><br/><br/>
      <Link href={"/playlist-builder/" + playlist.id}><button>Build this playlist</button></Link>
    </div>
  )
}