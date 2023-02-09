import { useSession, signIn, signOut } from "next-auth/react"
import Head from 'next/head';
import Link from 'next/link';

const Layout = ({children}: any) => {
  return (
    <div>
      <Head>
        <title></title>
        <meta name="description" content="Spotify Stats" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <nav>
          <Link href="/"><h2>Spotify Stats</h2></Link>
          <Link href="/top-artists">Top Artists</Link>
          <Link href="/top-tracks">Top Tracks</Link>
          <Link href="/top-tracks-stats">Top Track Stats</Link>
          <Link href="/recommendations">Recommendations</Link>
          <Link href="/profile">Profile</Link>
          <ProfileLoginButton />
        </nav>
        {children}
      </main>
    </div>
  );
}

const ProfileLoginButton = () => {
  const { data: session } = useSession();
  if (session) {
    return (
      <button onClick={() => signOut()}>Sign out</button>
    )
  } else {
    return (
      <button onClick={() => signIn()}>Sign in</button>
    )
  }
}

export default Layout;