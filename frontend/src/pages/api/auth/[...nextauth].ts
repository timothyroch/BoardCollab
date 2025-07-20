import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

declare module "next-auth" {
    interface Session {
        accessToken?: string;
        refreshToken?: string;
        scope?: string;
        expiresAt?: number;
        user: {
            name?: string | null;
            email?: string | null;
            image?: string | null;
            userId?: string;
            tenantId?: string | null;
            };
    }
    }


export default NextAuth({
    providers: [
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
              authorization: {
                params: {
                scope: 'openid email profile https://www.googleapis.com/auth/calendar.events',
                access_type: 'offline',
                prompt: 'consent',
                },
            },
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
                    console.log('resolve-user response:', data);

                    token.accessToken = account.access_token;
                    token.refreshToken = account.refresh_token;
                    token.expiresAt = account.expires_at ? account.expires_at * 1000 : undefined;
                    token.scope = account.scope;
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
            session.refreshToken = typeof token.refreshToken === "string" ? token.refreshToken : undefined;
            session.scope = typeof token.scope === "string" ? token.scope : undefined;
            session.expiresAt = typeof token.expiresAt === "number" ? token.expiresAt : undefined;

            session.user = {
                ...session.user,
                userId: typeof token.userId === "string" ? token.userId: undefined,
                tenantId: typeof token.tenantId === "string" || token.tenantId === null || token.tenantId === undefined
                    ? token.tenantId
                    : undefined,
            };
            return session;
        },
    },
});