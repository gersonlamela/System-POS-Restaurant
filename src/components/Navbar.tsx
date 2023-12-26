

import Link from "next/link";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

import UserAccountnav from "./UserAccountnav";
import InactivityTimeoutComponent from "./userInativaty";
import Image from "next/image";

export default async function Navbar() {
  const session = await getServerSession(authOptions);
  return (
    <InactivityTimeoutComponent>
      <div className="flex items-center bg-white  shadow-xl border-b border-s-zinc-200 w-full  rounded  h-[80px] ">
        <div className="w-full flex items-center justify-between px-[20px]">
          <Link href="/">
            <Image src="/logo.svg" width={80} height={80} alt="logo"/>
          </Link>

          {session?.user ? (
           
              <UserAccountnav name={session.user.username} />
           
         
          ) : (
            <p>SYSTEM POS</p>
          )}
        </div>
      </div>
    </InactivityTimeoutComponent>
  );
}
