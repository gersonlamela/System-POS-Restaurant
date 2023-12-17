import { prisma } from '@/lib/prisma';
import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { User as PrismaUser } from '@prisma/client';

interface UserWithRandomKey extends PrismaUser {
  randomKey: string;
}


export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
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
        pin: { label: 'pin', type: 'text' }
      },
      async authorize(credentials) {
        if (!credentials?.id && !credentials?.pin) {
          throw new Error('Por favor, forneça ID ou PIN para fazer login.');
        }

        const user = await prisma.user.findUnique({
          where: {
            id: credentials.id
          }
        });

        if (!user) {
          throw new Error('Usuário não encontrado');
        }

        const pinNumber = Number(credentials.pin);

        // Verifica se o PIN fornecido é igual ao PIN do usuário
        if (pinNumber !== user.pin) {
          throw new Error('PIN incorreto');
        }

  

        return {
          ...(user as UserWithRandomKey),
          id: user.id + '',
          email: user.email,
          name: user.username,
          role: user.role,
          randomKey: 'your_random_key_value',
        };
      }
    })
  ],
  callbacks: {
    session: async ({ session, token }) => {
      // session callback is called whenever a session for that particular user is checked
     // in above function we created token.user=user
      session.user = token.user;
      // you might return this in new version
      return Promise.resolve(session)
    },
    async jwt({ token, user }) {
      if (user) {
        token = user;
        // token = user;
        token.user=user
      }
      return Promise.resolve(token);
    },
  }
  
  
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
