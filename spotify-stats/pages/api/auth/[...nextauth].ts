import NextAuth, { Session } from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"

if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
  throw new Error("Spotify client ID/secret is required, please check your env variables")
}

export default NextAuth({
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET
    })
  ],
  callbacks: {
    async jwt({token, user, account}) {
      if (user) {
        token.id = user.id;
      }
      if (account?.refresh_token) {
        token.refreshToken = account.refresh_token;

      }
      return token;
    },
    async session({ session, token }) {
      return {...session, token} 
    }
  }
})