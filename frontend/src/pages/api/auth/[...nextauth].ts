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
        async jwt({ token, account, profile }) {
            if (account && profile?.email) {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/resolve-user`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: profile.email,
                        name: profile.name,
                        image: profile.image,
                    }),
                    });

                    const data = await res.json();

                    token.accessToken = account.access_token;
                    token.userId = data.userId;
                    token.tenantId = data.tenants?.[0]?.id || null;
                } catch (err) {
                    console.error('Failed to resolve user:', err);
                }
                }
            return token;
        },
        async session({ session, token }) {
            session.accessToken = typeof token.accessToken === "string" ? token.accessToken : undefined;
            session.user = {
                ...session.user,
                userId: token.userId,
                tenantId: typeof token.tenantId === "string" || token.tenantId === null || token.tenantId === undefined
                    ? token.tenantId
                    : undefined,
            };
            return session;
        },
    },
});