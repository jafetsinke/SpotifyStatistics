import { useSession } from 'next-auth/react'

export default function Home() {
  const { data: session } = useSession()

  if (!session) {
    return (
      <>
        <h1>Not signed in. pls sign in :)</h1>
      </>
    )
  } else {
    return (
      <>
        <h1>hello world</h1>
      </>
    )
  }
}
