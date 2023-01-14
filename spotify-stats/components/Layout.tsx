import { useSession, signIn, signOut } from "next-auth/react"
import Head from 'next/head';
import Link from 'next/link';

const Layout = ({children}: any) => {
  const { data: session } = useSession();

  return (
    <div>
      <Head>
        <title></title>
        <meta name="description" content="Spotify Stats" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
				<nav>
					<Link href="/"><h1>Spotify Stats</h1></Link>
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
				<Link href="/profile"><p>Logged in as {session?.user?.email}</p></Link>
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