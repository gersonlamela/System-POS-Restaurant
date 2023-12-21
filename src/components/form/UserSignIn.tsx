
import { User } from "next-auth";
import UserCard from "../dashboard/UserCard";
import Link from "next/link";


export async function getUsers() {

  const result  = await fetch('http://localhost:3000/api/user/getUsers', {method: 'GET'})
  if (result.ok) {
    return result.json();
  }
  return [];
} 

export async function UserSignIn() {
  const user = await getUsers()
 return (

  <div className="flex flex-wrap  gap-5 items-center justify-center" >
  {user.user.map((user:User,index:any) => ( 
    <Link key={index} href={`/sign-in/${user.id}`}>
      <UserCard  name={user.username} id={user.id} email="" role={user.role}  />
    </Link>
  ))}
    </div>
  )
}