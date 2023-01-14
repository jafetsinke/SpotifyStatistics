import { useSession, signIn, signOut } from "next-auth/react"
import Head from 'next/head';

const Layout = ({children}: any) => {
  return (
    <div>
      <Head>
        <title>Spotify Stats</title>
        <meta name="description" content="Spotify Stats" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
				<nav>
					<h1>Spotify Stats</h1>
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
			<>
				<p>Logged in as {session?.user?.email}</p>
				<button onClick={() => signOut()}>Sign out</button>
			</>
		)
	} else {
		return (
			<button onClick={() => signIn()}>Sign in</button>
		)
	}
}

export default Layout;