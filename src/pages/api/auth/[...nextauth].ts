import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import argon2 from "argon2";
import prisma from "@/lib/prisma";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (credentials == null) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
        });

        if (user == null) {
          // user does not exist
          return null;
        }

        if (await argon2.verify(user.password, credentials.password)) {
          return { id: user.email, user: user };
        } else {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }: any) {
      if (user) {
        token.username = user.user.username;
        token.role = user.user.role;
        token.firstName = user.user.firstName;
        token.lastName = user.user.lastName;
      }
      if (trigger === "update" && session?.firstName && session?.lastName) {
        // Note, that `session` can be any arbitrary object, remember to validate it!
        token.firstName = session.firstName;
        token.lastName = session.lastName;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token && session.user) {
        session.user.username = token.username;
        session.user.role = token.role;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
