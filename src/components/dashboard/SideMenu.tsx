'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { LayoutDashboard, Users } from 'lucide-react'
import { usePathname } from 'next/navigation'
import ButtonDarkmode from '../ui/ButtonDarkmode'
import UserCard from './UserCard'
import { ForkKnife } from '@phosphor-icons/react'

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
]

export default function SideMenu() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-[90px] transform flex-col items-center justify-between p-[50px] shadow-md md:w-[200px]">
      <div className="flex flex-col gap-[50px]">
        <div className="flex flex-col items-center justify-center gap-[10px] md:flex-row">
          <div className=" flex h-[50px] w-[50px] items-center justify-center rounded-full bg-primary-foreground">
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
                pathname === item.href ? 'bg-primary text-white' : ''
              } flex h-[40px]  w-[40px] items-center justify-center gap-[24px] rounded-lg text-text md:w-full md:justify-start md:p-4`}
            >
              {item.icon}
              <span
                className={`${
                  pathname === item.href ? 'text-text' : ''
                }  hidden text-lg  md:flex`}
              >
                {item.title}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-[30px]">
        <ButtonDarkmode />
        <UserCard />
      </div>
    </div>
  )
}
