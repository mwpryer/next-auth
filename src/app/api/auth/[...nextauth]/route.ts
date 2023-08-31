import NextAuth, { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import GithubProvider from "next-auth/providers/github"
import DiscordProvider from "next-auth/providers/discord"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { Adapter } from "next-auth/adapters"
import bcrypt from "bcrypt"
import { prisma } from "@/utils/db"

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: "text" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) throw new Error("Missing fields")
        const user = await prisma.user.findUnique({ where: { email: credentials.email } })
        if (!user || !user.hashedPassword || !(await bcrypt.compare(credentials.password, user.hashedPassword))) throw new Error("Invalid credentials")
        return user
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/",
    signOut: "/",
  },
  adapter: PrismaAdapter(prisma) as Adapter,
  debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
