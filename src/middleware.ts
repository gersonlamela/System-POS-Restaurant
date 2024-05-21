import { withAuth } from 'next-auth/middleware'

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      const path = req.nextUrl.pathname

      console.log(token)
      if (path.startsWith('/dashboard')) {
        return token?.role === 'ADMIN' || token?.role === 'MANAGER'
      }

      return token !== null
    },
  },
})

// Define paths for which the middleware will run
export const config = {
  matcher: ['/pos/:path*', '/dashboard/:path*'],
}
