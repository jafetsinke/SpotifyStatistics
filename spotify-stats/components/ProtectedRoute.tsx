import { useSession } from 'next-auth/react';

export default function ProtectedRoute({children}: React.PropsWithChildren) {
  const { data: session } = useSession()

  if (!session) {
    return (
      <>
        <h1>no user session</h1>
        <p>sign in at top right!</p>
      </>
    )
  } else {
    return (
      <>{children}</>
    )
  }
}
