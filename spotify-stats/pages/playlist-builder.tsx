import ProtectedRoute from '@/components/ProtectedRoute';
import { useSession } from 'next-auth/react';

export default function Home() {
  return (
    <ProtectedRoute>
      <h1>Playlist Builder</h1>
    </ProtectedRoute>
  )
}
