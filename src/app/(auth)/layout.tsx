import { FC, ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
}

const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="h-full w-full rounded-md bg-slate-200 p-10">{children}</div>
  )
}

export default AuthLayout
