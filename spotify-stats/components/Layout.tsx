import { useSession, signIn, signOut } from "next-auth/react"
import Head from 'next/head';
import Link from 'next/link';
import React from "react";

const Layout = ({children}: React.PropsWithChildren) => {
  return (
    <div>
      <Head>
        <title></title>
        <meta name="description" content="Spotify Stats" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <nav>
          <SessionBasedNavItems />
        </nav>
        {children}
      </main>
    </div>
  );
}

const SessionBasedNavItems = () => {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        <Link href="/"><h2>Spotify Stats</h2></Link>
        <Link href="/top-artists">Top Artists</Link>
        <Link href="/top-tracks">Top Tracks</Link>
        <Link href="/top-tracks-stats">Top Track Stats</Link>
        <Link href="/recommendations">Recommendations</Link>
        <Link href="/playlist-builder">Playlist Builder</Link>
        <Link href="/profile">Profile</Link>
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  } else {
    return (
      <>
        <Link href="/"><h2>Spotify Stats</h2></Link>
        <button onClick={() => signIn()}>Sign in</button>
      </>
    )
  }
}

export default Layout;