import { FC, ReactNode } from 'react'

interface POSLayoutProps {
  children: ReactNode
}

const POSLayout: FC<POSLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-full w-full flex-row  items-center justify-center gap-[20px] rounded-md  bg-[#F9F8FB]  px-[20px] py-[20px] ">
      {children}
    </div>
  )
}

export default POSLayout
