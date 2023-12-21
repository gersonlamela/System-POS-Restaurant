
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import User from "@/components/user";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UserSignIn } from "@/components/form/UserSignIn";



export default async function Home() {
  const session = await getServerSession(authOptions);



  return (
    <div className="p-4">
      <h1 className="text-4xl">Home</h1>
      <UserSignIn/>
     
    </div>
  );
}
