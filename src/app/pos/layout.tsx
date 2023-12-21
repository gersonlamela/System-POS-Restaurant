import Navbar from '@/components/Navbar';
import { SideBar } from '@/components/SideBar';
import { FC, ReactNode } from 'react';

interface POSLayoutProps {
  children: ReactNode;
}

const POSLayout: FC<POSLayoutProps> = ({ children }) => {
  return <div className='bg-[#F9F8FB]  rounded-md w-full h-full'>
    <div className='flex flex-row h-full w-full'>
   <SideBar/>
{/*     <Navbar /> */}
 
    </div>
    {children}</div>;
};

export default POSLayout;