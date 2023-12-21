import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import { compare } from "bcrypt";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session:{
    strategy: "jwt",
  },
  pages:{
    signIn: '/',
  },
  providers: [
    CredentialsProvider({
      name: "signin",
      credentials: {
        id: { label: "id", type: "text", placeholder: "id" },
        pin: { label: "pin", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.id && !credentials?.pin) {
          throw new Error('Por favor, forneça ID ou PIN para fazer login.');
        }

        const existigUser = await prisma.user.findUnique({
          where: {
            id: credentials.id
          }
        });



        if (!existigUser) {
          throw new Error('Usuário não encontrado');
        }

        const pinMatch = await compare(credentials.pin, existigUser.pin);
        console.log(pinMatch)

        if(!pinMatch) {
          throw new Error('Pin inválido');
        }

        return {
          id: `${existigUser.id}`,
          email: existigUser.email,
          username: existigUser.username,
          role: existigUser.role,
        };
      }
    })
  ], 
  callbacks: {
    async jwt({ token, user }) {
      if(user){
        return {
              ...token,
              username: user.username,
              role: user.role
            }
      }
      return token
    },
    async session({ session, user, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          username: token.username,
          role: token.role
        }
      }
    },
  }
}

