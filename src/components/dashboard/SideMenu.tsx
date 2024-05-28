/* eslint-disable prettier/prettier */
'use client'

import Link from 'next/link'
import { LayoutDashboard } from 'lucide-react'
import { usePathname } from 'next/navigation'
import UserCard from './UserCard'
import { Carrot, ChartLineUp, ForkKnife, NoteBlank, Users } from '@phosphor-icons/react'

const menuItems = [
  {
    icon: <ForkKnife size={24} />,
    title: 'Produtos',
    href: '/dashboard/products',
  },
  {
    icon: <Carrot size={24} />,
    title: 'Ingredientes',
    href: '/dashboard/ingredients',
  },
  {
    icon: <LayoutDashboard size={24} />,
    title: 'Categorias',
    href: '/dashboard/categories',
  },
  {
    icon: <NoteBlank size={24} />,
    title: 'Pedidos',
    href: '/dashboard/orders',
  },
  {
    icon: <ChartLineUp size={32} />,
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    icon: <Users size={32} />,
    title: 'Utilizadores',
    href: '/dashboard/users',
  },




]

export default function SideMenu() {
  const pathname = usePathname()

  return (
    <div className="flex h-full min-w-[220px] max-w-[220px]  transform flex-col bg-white justify-between rounded-[10px] px-[15px] shadow-md">

      <div className="mt-4 flex flex-col items-center justify-center gap-[10px] md:flex-row">
        <h1 className="text-[22px]  text-third font-bold">POSLamela</h1>
      </div>

      <div className=" flex flex-col items-center justify-start  gap-[20px]">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={`${pathname === item.href ? 'bg-primary text-white ' : ''
              } flex h-[40px]  w-[40px] items-center justify-center gap-[24px] rounded-[10px] text-[18px] md:w-full md:justify-start md:p-4 shadow-button5`}
          >
            {item.icon}
            <span
              className={`${pathname === item.href ? '' : ''
                }  hidden text-lg  md:flex`}
            >
              {item.title}
            </span>
          </Link>
        ))}
      </div>


      <div className="flex flex-col items-center justify-center gap-[30px]">
        <UserCard />
      </div>
    </div>
  )
}
