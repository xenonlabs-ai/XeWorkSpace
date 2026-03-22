import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

interface Organization {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      organizationId: string | null;
      organization: Organization | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: string;
    organizationId?: string | null;
    organization?: Organization | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: string;
    organizationId: string | null;
    organization: Organization | null;
  }
}
