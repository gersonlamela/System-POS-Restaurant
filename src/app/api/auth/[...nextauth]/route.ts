import { prisma } from '@/lib/prisma'


import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt'
  },
  providers: [
    CredentialsProvider({
      name: 'Sign in',
      credentials: {
        id: {
          label: 'id',
          type: 'text',
          placeholder: 'id user'
        },
        pin: { label: 'pin', type: 'pin' }
      },
      async authorize(credentials) {
        if (!credentials?.id || !credentials.pin) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            id: credentials.id
          }
        })

        if (!user) {
          return null
        }

        return {
          id: user.id + '',
          email: user.email,
          name: user.username,
          randomKey: 'Hey cool'
        }
      }
    })
  ],
  callbacks: {
    session: ({ session, token }) => {
      console.log('Session Callback', { session, token })
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          randomKey: token.randomKey
        }
      }
    },
    jwt: ({ token, user }) => {
      console.log('JWT Callback', { token, user })
      if (user) {
        const u = user as unknown as any
        return {
          ...token,
          id: u.id,
          randomKey: u.randomKey
        }
      }
      return token
    }
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }