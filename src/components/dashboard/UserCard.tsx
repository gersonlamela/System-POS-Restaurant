
'use client'

import { authOptions } from "@/lib/auth";
import { LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";


export default  function UserCard() {
  const { data: session } = useSession()
 return(
  <div className="flex flex-col items-center justify-center md:flex-row gap-2 ">
  {session?.user.username}

  <button onClick={()=> signOut() }><LogOut size={17}/></button>
</div>
 )

}