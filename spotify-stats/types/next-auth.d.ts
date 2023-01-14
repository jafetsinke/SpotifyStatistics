import { JWT } from "next-auth/jwt";
import NextAuth, { DefaultSession } from "next-auth/next";

declare module "next-auth" {
  interface Session {
    token: JWT
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    refreshToken: string;
  }
}