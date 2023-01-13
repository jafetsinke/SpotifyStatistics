import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"

if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
  throw new Error("Spotify client ID/secret is required, please check your env variables")
}

export const authOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET
    })
  ],
}
export default NextAuth(authOptions)