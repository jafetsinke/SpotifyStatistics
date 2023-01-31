import { useSession } from 'next-auth/react'
import { useState } from 'react';

export default function Recommendations() {
  const { data: session } = useSession()

  const [isLoading, setLoading] = useState(false);

  if (!session) {
    return (<h2>Not signed in. pls sign in :)</h2>)
  }

  if (isLoading) {
    return (<h1>Loading...</h1>)
  }

  return (
    <>
      <h1>Recommendations</h1>
    </>
  )
}
