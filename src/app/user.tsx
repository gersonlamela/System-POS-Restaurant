'use client'

import { signOut, useSession } from "next-auth/react"

export const User = () => {
  const {data:session} = useSession();
  return (<>  
    <button  onClick={() => signOut()}>Sign out </button>
  <pre>{JSON.stringify(session)}</pre></>)
}
