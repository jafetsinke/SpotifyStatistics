import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Profile() {
  const { data: session } = useSession()

  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetch('api/spotify/me')
      .then((res) => res.json())
      .then((data) => {
        setProfile(data.responseJSON);
      });
  }, []);

  if (!session) {
    return (<h2>Not signed in. pls sign in :)</h2>)
  }

  if (!profile) {
    return (<h1>Loading...</h1>)
  }

  // TODO suggest to pick image based on target resolution (200x200)
  return (
    <>
      <Image src={profile.images[0].url} alt="Your Spotify profile picture" width="200" height="200"></Image>
      <h1>Profile</h1>
      <p><strong>Display name: </strong> {profile.display_name}</p>
      <p><strong>Followers: </strong> {profile.followers.total}</p>
      <p><strong>User ID: </strong> {profile.id}</p>
      <Link href={profile.external_urls.spotify}>View on Spotify</Link>
    </>
  )
}
