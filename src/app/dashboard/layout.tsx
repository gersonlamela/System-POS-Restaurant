import SideMenu from '@/components/dashboard/SideMenu'
import { Metadata } from 'next'

import { FC, ReactNode } from 'react'

interface DashboardLayoutProps {
  children: ReactNode
}
export const metadata: Metadata = {
  title: 'Dashboard',
}

const DashboardLayout: FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-full w-full flex-row ">
      <SideMenu />
      {children}
    </div>
  )
}

export default DashboardLayout
