'use client'

import { LayoutDashboard, Users } from 'lucide-react'
import { ForkKnife, PicnicTable, Scroll } from '@phosphor-icons/react'

const menuItems = [
  {
    icon: <PicnicTable size={24} />,
    title: 'Mesas',
    href: '/order',
  },
  {
    icon: <Users size={24} />,
    title: 'Menus',
    href: '/dashboard/products',
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
    <div className="flex  h-[95px] flex-1 flex-row items-start justify-start gap-[15px] overflow-scroll bg-white pb-[10px] pr-[15px] pt-[15px]">
      {menuItems.map((item, index) => (
        <a
          href={item.href}
          key={index}
          className=" flex h-[70px] min-w-[186.3px] max-w-[186.3px]  flex-col   rounded-[10px] bg-secondary p-[15px]"
        >
          <div className="flex w-full  items-center justify-end text-base font-medium text-white">
            {item.icon}
          </div>

          <div className="flex w-full items-center justify-start text-base font-medium text-white">
            {item.title}
          </div>
        </a>
      ))}
    </div>
  )
}
