import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export default async function page() {
  const session = await getServerSession(authOptions)

  if(session?.user){
    return <h1 className="text-2xl">Admin page - Welcome back {session?.user.username}</h1>;
  }
 return <h2>Please login to see this admin page</h2>;
}