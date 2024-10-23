import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient()

const handler = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID ?? "",
            clientSecret: process.env.GITHUB_SECRET ?? "",
        }),
    ],
    session: { strategy: "jwt" },
    callbacks: {
        async jwt({ token, user, account }) {

            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
            }

            if (account) {
                token.accessToken = account.access_token;
            }

            return token;
        },
        async session({session, token}) {
            session.user = token;
            return session;
        }
    },
});

export { handler as GET, handler as POST };

