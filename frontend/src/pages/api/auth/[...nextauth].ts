import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

declare module "next-auth" {
    interface Session {
        accessToken?: string;
    }
    }


export default NextAuth({
    providers: [
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
    ],
    jwt: {
        secret: process.env.JWT_SECRET || "defaultsecret",
    },
    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                token.accessToken = account.access_token;
            }
            return token;
        },
        async session({ session, token }) {
            session.accessToken = typeof token.accessToken === "string" ? token.accessToken : undefined;
            return session;
        },
    },
});