import SideMenu from '@/components/dashboard/SideMenu'
import { Time } from '@/components/dashboard/TimeDashboard'
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
    <div className="relative flex max-h-screen w-full flex-row gap-[15px]">
      <div className="z-50 h-full py-[15px] pl-[15px]">
        <SideMenu />
      </div>

      <div className="flex flex-1 flex-col gap-[15px] py-[15px] pr-[15px]">
        <div className="flex max-h-[50px] w-full flex-1 flex-row gap-[15px] ">
          <Time />
        </div>

        <div className="flex flex-1  flex-col justify-between overflow-auto">
          <div className="flex flex-1 overflow-auto">{children}</div>
          <div className="flex ">
            <MenuList />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
