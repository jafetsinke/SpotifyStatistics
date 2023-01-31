import { useSession } from 'next-auth/react'

export default function Recommendations() {
  const { data: session } = useSession()

  if (!session) {
    return (<h2>Not signed in. pls sign in :)</h2>)
  }

  return (
    <>
      <h1>Recommendations</h1>
    </>
  )
}
