'use client'

import { ProductCategory } from '@prisma/client'
import { signOut } from 'next-auth/react'
import Image from 'next/image'

interface SideBarProps {
  categories: ProductCategory[]
}

export function SideBar(categories: SideBarProps) {
  console.log(categories)
  return (
    <div className="inset-0  z-50 h-full w-[155px]  ">
      <div className="flex h-full w-full flex-col  items-center justify-between rounded-xl bg-white p-[20px] shadow-lg">
        <Image src="/logo.svg" alt="logo" width={100} height={100} />
        <div>
          {categories.categories.map((category) => (
            <div key={category.id} className="flex items-center gap-[10px]">
              <img src={`/uploads/icons/${category.icon}`}></img>
              <span>{category.name}</span>
            </div>
          ))}
        </div>
        <div>
          <button onClick={() => signOut()}>
            <Image src="/Logout-Icon.png" alt="logo" width={20} height={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
