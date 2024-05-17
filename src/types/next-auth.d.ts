import 'next-auth'

declare module 'next-auth' {
  interface User {
    username: string
    role: string
  }
  interface Session {
    user: User & {
      username: string
      role: string
      name: string
      email: string
      image: string
    }
    token: {
      username: string
      role: string
    }
  }
}
