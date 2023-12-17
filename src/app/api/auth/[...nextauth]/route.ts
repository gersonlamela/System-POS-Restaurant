import { prisma } from '@/lib/prisma';
import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';


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

        const existigUser = await prisma.user.findUnique({
          where: {
            id: credentials.id
          }
        });

        if (!existigUser) {
          throw new Error('Usuário não encontrado');
        }

        const pinNumber = Number(credentials.pin);

        // Verifica se o PIN fornecido é igual ao PIN do usuário
        if (pinNumber !== existigUser.pin) {
          throw new Error('PIN incorreto');
        }

        return {
          id: `${existigUser.id}`,
          email: existigUser.email,
          name: existigUser.username,
          role: existigUser.role,
        };
      }
    })
  ],
  callbacks: {
  async jwt({token, user}) {
   
    if(user){
      return {
        ...token,
        name: user.name,
        role: user.role,
      }
    }
      return token;
  },
  async session({session, token}) {
    return {
      ...session,
      user: {
        ...session.user,
        name: token.name,
        role: token.role,
      }
    }
  }
}
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
