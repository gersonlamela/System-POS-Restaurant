import SideMenu from '@/components/dashboard/SideMenu'
import MenuList from '@/components/pos/MenuList'
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
      <div className="flex flex-1  flex-col justify-between overflow-auto p-10">
        {children}
        <MenuList />
      </div>
    </div>
  )
}

export default DashboardLayout
