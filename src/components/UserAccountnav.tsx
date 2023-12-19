'use client'

import { signOut } from "next-auth/react";
import { Button } from "./ui/button";


interface userProps {
  name:string;
}
export default function UserAccountnav(userProps:userProps) {
 return   <div className="flex  items-center justify-center gap-2">
  <h1 className="text-2xl font-bold">{userProps.name}</h1>
<Button onClick={() => signOut({redirect:true,callbackUrl: `${window.location.origin}/sign-in`})} variant="destructive">Sign Out</Button>
 </div>
}
