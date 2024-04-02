import { withAuth } from 'next-auth/middleware'
import { handleVerifyUserExist } from './functions/user/user'

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      const path = req.nextUrl.pathname

      if (path.startsWith('/dashboard')) {
        return token?.role === 'ADMIN'
      }

      return token !== null
    },
  },
})

// Define paths for which the middleware will run
export const config = {
  matcher: ['/pos/:path*', '/dashboard/:path*'],
}
