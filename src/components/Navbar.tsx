import Link from 'next/link'

import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'

import UserAccountnav from './UserAccountnav'
import InactivityTimeoutComponent from './userInativaty'
import Image from 'next/image'

export default async function Navbar() {
  const session = await getServerSession(authOptions)
  return (
    <InactivityTimeoutComponent>
      <div className="flex h-[80px] w-full  items-center rounded border-b border-s-zinc-200  bg-white  shadow-xl ">
        <div className="flex w-full items-center justify-between px-[20px]">
          <Link href="/">
            <Image src="/logo.png" width={80} height={80} alt="logo" />
          </Link>

          {session?.user ? (
            <UserAccountnav name={session.user.username} />
          ) : (
            <p>SYSTEM POS</p>
          )}
        </div>
      </div>
    </InactivityTimeoutComponent>
  )
}
