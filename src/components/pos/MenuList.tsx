'use client'

import { LayoutDashboard, Users } from 'lucide-react'
import { ForkKnife, PicnicTable, Scroll } from '@phosphor-icons/react'
import Link from 'next/link'

const menuItems = [
  {
    icon: <PicnicTable size={24} />,
    title: 'Mesas',
    href: '/',
  },
  {
    icon: <Users size={24} />,
    title: 'Menus',
    href: '/menus',
  },
  {
    icon: <ForkKnife size={24} />,
    title: 'Pedidos',
    href: '/dashboard/orders',
  },
  {
    icon: <LayoutDashboard size={24} />,
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    icon: <LayoutDashboard size={24} />,
    title: 'Gaveta',
    href: '',
  },
  {
    icon: <Scroll size={24} />,
    title: 'Imprimir',
    href: '',
  },
]

export default function MenuList() {
  return (
    <div className="flex w-full flex-row items-start gap-[15px] overflow-x-auto bg-white ">
      {menuItems.map((item, index) => (
        <Link
          href={item.href}
          key={index}
          className="flex h-[70px] w-full  flex-col rounded-[10px] bg-secondary p-[15px]"
        >
          <div className="flex w-full items-center justify-end text-base font-medium text-white">
            {item.icon}
          </div>

          <div className="flex w-full items-center justify-start text-base font-medium text-white">
            {item.title}
          </div>
        </Link>
      ))}
    </div>
  )
}
