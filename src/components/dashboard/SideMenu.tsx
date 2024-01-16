"use client";

import { signOut } from "next-auth/react";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { LayoutDashboard, Users } from "lucide-react";
import { usePathname } from "next/navigation";
import ButtonDarkmode from "../ui/ButtonDarkmode";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import UserCard from "./UserCard";

const menuItems = [
  {
    icon: <LayoutDashboard size={24} />,
    title: "Dashboard",
    href: "/dashboard",
  },
  { icon: <Users size={24} />, title: "Users", href: "/dashboard/users" },
  {
    icon: <LayoutDashboard size={24} />,
    title: "Dashboard",
    href: "/dashboard21",
  },
  { icon: <Users size={24} />, title: "Users", href: "/dashboard/users21" },
];

export default  function SideMenu() {
  const pathname = usePathname();

  return (
    <div className="w-[90px] md:w-[200px] h-full flex flex-col items-center justify-between p-[50px] shadow-md transform">
    


<div className="flex flex-col gap-[50px]">
<div className="flex flex-col items-center justify-center md:flex-row gap-[10px]">
     
     <div className=" w-[50px] h-[50px] bg-primary-foreground rounded-full flex items-center justify-center">
     <Image src="/logo.svg" alt="logo" width={50} height={50} />
     </div>
     <h1 className="font-medium  hidden md:flex md:text-xl">POS</h1>

     
   </div>
<div className=" flex items-center justify-start flex-col  gap-[20px]">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={`${
              pathname === item.href ? "bg-primary text-white" : ""
            } h-[40px] w-[40px]  md:w-full rounded-lg flex text-text items-center justify-center md:justify-start md:p-4 gap-[24px]`}
          >
            {item.icon}
            <span   className={`${
                pathname === item.href ? 'font-semibold text-text' : ''
              }  text-lg hidden  md:flex`}>{item.title}</span>
          </Link>
        ))}
      </div>
</div>
    
    
    


      <div className="flex flex-col items-center justify-center gap-[30px]">
      <ButtonDarkmode/>
    <UserCard/>
      </div>
    </div>

  );
}
