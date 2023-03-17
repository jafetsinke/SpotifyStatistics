import ProtectedRoute from '@/components/ProtectedRoute';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { SpotifyPlaylist } from '@/lib/spotify';


export default function PlaylistBuilder(props: {id: string}) {
  const router = useRouter();
  const { id } = router.query;

  const [playlist, setPlaylist] = useState<SpotifyPlaylist>();


  useEffect(() => {
    if (!id) return;
    fetch(`/api/spotify/me/playlists/` + id)
      .then((res) => res.json())
      .then((data) => {
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
    </ProtectedRoute>
  )
}