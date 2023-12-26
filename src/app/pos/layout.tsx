import Navbar from "@/components/Navbar";
import { SideBar } from "@/components/SideBar";
import { FC, ReactNode } from "react";

interface POSLayoutProps {
  children: ReactNode;
}

const POSLayout: FC<POSLayoutProps> = ({ children }) => {
  return (
    <div className="bg-[#F9F8FB] flex flex-row rounded-md w-full h-full  py-[20px]  px-[20px] gap-[20px] ">
      <div className="flex flex-row flex-1  ">
        <SideBar />
      </div>
      <div className="flex flex-col w-full h-full gap-[20px]">
        <Navbar />
        <div className="bg-red-500 w-full h-full">{children}</div>
      </div>
    </div>
  );
};

export default POSLayout;
