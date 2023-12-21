'use client'

import { signOut } from "next-auth/react";
import Image from "next/image";


export  function SideBar() {
 return (
  <div className='w-[155px]  z-50 h-full inset-0 px-[14px] py-[20px]'>
    <div className="flex items-center justify-between flex-col  w-full h-full rounded-xl bg-white shadow-lg p-[20px]">
      <Image src="/logo.svg" alt="logo" width={100} height={100}/>
      <div>
      <Image src="/Menu-Icons.png" alt="logo" width={100} height={100}/>
      </div>
      <div>
        <button onClick={() => signOut()}>
        <Image src="/Logout-Icon.png" alt="logo" width={20} height={20}/>
        </button>
   
      </div>
    </div>
</div>

 )
}