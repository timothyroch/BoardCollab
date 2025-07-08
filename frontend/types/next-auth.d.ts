import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      tenantId?: string | null; 
    } & DefaultSession["user"];
    accessToken?: string;
  } 

  interface User extends DefaultUser{
    tenantId?: string | null;
    tenantId?: string;
  }

    interface JWT {
    accessToken?: string;
    userId?: string;
    tenantId?: string;
  }
}
