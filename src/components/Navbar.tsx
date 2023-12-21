import Link from 'next/link';
import { Button, buttonVariants } from './ui/button';
import { HandMetal } from 'lucide-react';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { signOut } from 'next-auth/react';
import UserAccountnav from './UserAccountnav';
import InactivityTimeoutComponent from './userInativaty';

export default async function Navbar(){

  const session = await getServerSession(authOptions)
  return (
    <InactivityTimeoutComponent>
    <div className=' bg-red-500 py-2 border-b border-s-zinc-200  w-full h-[80px]  '>
      <div className='container flex items-center justify-between'>
        <Link href='/'>
          <HandMetal />
        </Link>
      
        {session?.user ? (
          <UserAccountnav name={session.user.username} />
        ): (
            <Link className={buttonVariants()} href='/sign-in'>
            Sign in
          </Link>
        )}
      </div>
    </div>
    </InactivityTimeoutComponent>
  );
};
