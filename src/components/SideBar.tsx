'use client'

import { signOut } from 'next-auth/react'
import Image from 'next/image'

export function SideBar() {
  return (
    <div className="inset-0  z-50 h-full w-[155px]  ">
      <div className="flex h-full w-full flex-col  items-center justify-between rounded-xl bg-white p-[20px] shadow-lg">
        <Image src="/logo.svg" alt="logo" width={100} height={100} />
        <div>
          <Image src="/Menu-Icons.png" alt="logo" width={100} height={100} />
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
