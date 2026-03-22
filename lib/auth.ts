import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            organization: {
              select: {
                id: true,
                name: true,
                slug: true,
                logo: true,
              },
            },
          },
        });

        if (!user || !user.password) {
          throw new Error("User not found");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role,
          image: user.avatar,
          organizationId: user.organizationId,
          organization: user.organization,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.organizationId = (user as any).organizationId;
        token.organization = (user as any).organization;
      }

      // Refresh organization data on session update
      if (trigger === "update" && token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          include: {
            organization: {
              select: {
                id: true,
                name: true,
                slug: true,
                logo: true,
              },
            },
          },
        });
        if (dbUser) {
          token.role = dbUser.role;
          token.organizationId = dbUser.organizationId;
          token.organization = dbUser.organization;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
        (session.user as any).organizationId = token.organizationId;
        (session.user as any).organization = token.organization;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
