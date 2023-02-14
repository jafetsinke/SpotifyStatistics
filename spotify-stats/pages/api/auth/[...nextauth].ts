import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"

if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
  throw new Error("Spotify client ID/secret is required, please check your env variables")
}

export default NextAuth({
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      authorization: "https://accounts.spotify.com/authorize?scope=user-read-email,user-top-read,user-library-modify"
    })
  ],
  callbacks: {
    async jwt({token, user, account}) {
      if (user) {
        token.id = user.id;
      }
      if (account?.refresh_token && account?.access_token && account?.expires_at) {
        token.refreshToken = account.refresh_token;
        token.accessToken = account.access_token;
        token.accessTokenExpires = account.expires_at * 1000; // convert to ms from s
      }
      return token;
    },
    async session({ session, token }) {
      return {...session, token} 
    }
  }
})