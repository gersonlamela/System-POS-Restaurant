'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { LayoutDashboard, Users } from 'lucide-react'
import { usePathname } from 'next/navigation'
import UserCard from './UserCard'
import { Carrot, ForkKnife } from '@phosphor-icons/react'

const menuItems = [
  {
    icon: <LayoutDashboard size={24} />,
    title: 'Dashboard',
    href: '/dashboard',
  },
  { icon: <Users size={24} />, title: 'Users', href: '/dashboard/users' },
  {
    icon: <ForkKnife size={24} />,
    title: 'Products',
    href: '/dashboard/products',
  },
  {
    icon: <Carrot size={24} />,
    title: 'Ingredients',
    href: '/dashboard/ingredients',
  },
]

export default function SideMenu() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-[90px] transform flex-col justify-between px-[12px] shadow-md md:w-[250px]">
      <div className="flex flex-col gap-[50px]">
        <div className="flex flex-col items-center justify-center gap-[10px] md:flex-row">
          <div className=" bg-black-foreground flex h-[50px] w-[50px] items-center justify-center rounded-full">
            <Image src="/logo.png" alt="logo" width={50} height={50} />
          </div>
          <h1 className="hidden  font-medium md:flex md:text-xl">POS</h1>
        </div>
        <div className=" flex flex-col items-center justify-start  gap-[20px]">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`${
                pathname === item.href ? 'bg-black text-white ' : ''
              } flex h-[40px]  w-[40px] items-center justify-center gap-[24px] rounded-lg text-text md:w-full md:justify-start md:p-4`}
            >
              {item.icon}
              <span
                className={`${
                  pathname === item.href ? '' : ''
                }  hidden text-lg  md:flex`}
              >
                {item.title}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-[30px]">
        <UserCard />
      </div>
    </div>
  )
}
