
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import User from "@/components/user";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UserSignIn } from "@/components/form/UserSignIn";
import Navbar from "@/components/Navbar";



export default async function Home() {
  const session = await getServerSession(authOptions);



  return (
    <div>
      <Navbar/>
      <h1 className="text-4xl">Home</h1>
      <UserSignIn/>
     
    </div>
  );
}
