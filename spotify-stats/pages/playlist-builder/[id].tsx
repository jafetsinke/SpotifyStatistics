import ProtectedRoute from '@/components/ProtectedRoute';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { SpotifyArtist, SpotifyPlaylist, SpotifyPlaylistTrack } from '@/lib/spotify';
import { getImageURLWithTargetResolution } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';


export default function PlaylistBuilder(props: {id: string}) {
  const router = useRouter();
  const { id } = router.query;

  const [playlist, setPlaylist] = useState<SpotifyPlaylist>();


  useEffect(() => {
    if (!id) return;
    fetch(`/api/spotify/me/playlists/` + id)
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        setPlaylist(data);
      });
  }, [id]);

  if (!playlist) {
    return (
      <p>loading</p>
    )
  }

  return (
    <ProtectedRoute>
      <h1>Playlist Build: {playlist.name}</h1>
      <p>{id}</p>
      <p>duplicate tracks might break, limit is 100</p>
      <div className="tableContainer">
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Track</th>
              <th>Artist</th>
            </tr>
          </thead>
          <tbody>
            {playlist && playlist.tracks.items.map((item: SpotifyPlaylistTrack) => (
              <tr key={item.track.id}>
                <td><Image src={getImageURLWithTargetResolution(item.track.album.images, 64)} alt={`${item.track.name} Album image`} width="64" height="64" /></td>
                <td><Link href={item.track.external_urls.spotify}>{item.track.name}</Link></td>
                <td>{item.track.artists.map((artist: SpotifyArtist) => artist.name).join(', ')}</td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ProtectedRoute>
  )
}