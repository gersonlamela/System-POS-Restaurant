import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import { compareSync } from 'bcrypt-ts'
import { type NextAuthOptions } from 'next-auth'

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/',
  },
  providers: [
    CredentialsProvider({
      name: 'signin',
      credentials: {
        id: { label: 'id', type: 'text', placeholder: 'id' },
        pin: { label: 'pin', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.id && !credentials?.pin) {
          throw new Error('Por favor, forneça ID ou PIN para fazer login.')
        }

        const existigUser = await prisma.user.findUnique({
          where: {
            id: credentials.id,
          },
        })

        if (!existigUser) {
          throw new Error('Utilizador não encontrado')
        }

        const pinMatch = compareSync(credentials.pin, existigUser.pin) // true

        console.log(pinMatch)

        if (!pinMatch) {
          throw new Error('Pin inválido')
        }

        return {
          id: `${existigUser.id}`,
          email: existigUser.email,
          username: existigUser.name,
          role: existigUser.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          name: user.username,
          role: user.role,
          id: user.id,
        }
      }
      return token
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          name: token.name,
          role: token.role,
          id: token.id,
          email: token.email,
        },
      }
    },
  },
}
