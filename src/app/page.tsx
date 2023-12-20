
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import User from "@/components/user";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";



export default async function Home() {
  const session = await getServerSession(authOptions);



  return (
    <div className="p-4">
      <h1 className="text-4xl">Home</h1>
      <Link className={buttonVariants()} href={"/dashboard/admin"}>
        Open my Admin
      </Link>
      <h2>Client Session</h2>
      <User />
      <h2>Server Session</h2>
      <pre>{JSON.stringify(session)}</pre>
    </div>
  );
}
