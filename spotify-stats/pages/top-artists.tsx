import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Top from '@/components/Top';
import ProtectedRoute from '@/components/ProtectedRoute';

// TODO long-term: suggest to use CSS styling instead of direct use of <strong>
export default function TopArtists() {
  const { data: session } = useSession()

  return (
    <ProtectedRoute>
      <h1>Welcome to Spotify Stats</h1>
      <p>You&apos;re signed in as <strong><Link href="/profile">{session?.user?.email}</Link></strong> (click to show profile)</p>
      <Top type="artists" />
    </ProtectedRoute>
  )
}
