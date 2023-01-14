import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Home() {
  const { data: session } = useSession()

  if (!session) {
    return (
      <>
        <h1>Welcome to Spotify Stats</h1>
        <p>This is a simple tool made by Jafet Sinke to display your top tracks & artists</p>
        <strong>To get started, please sign in using your Spotify account in the top right corner.</strong>
      </>
    )
  } else {
    return (
      <>
        <h1>Welcome to Spotify Stats</h1>
        <p>You&apos;re signed in as <strong><Link href="/profile">{session?.user?.email}</Link></strong> (click to show profile)</p>
      </>
    )
  }
}
