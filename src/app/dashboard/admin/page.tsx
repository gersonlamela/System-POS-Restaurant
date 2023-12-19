'use client'


import UserCard from "@/components/dashboard/UserCard";
import { authOptions } from "@/lib/auth";
import { User } from "@prisma/client";

import { getServerSession } from "next-auth";
import { useEffect, useState } from "react";



export default  function AdminPage() {
  const [user, setUser] = useState<User[]>([])
  const [isLoading, setLoading] = useState(true)
 
  useEffect(() => {
    fetch('/api/user/getUsers')
      .then((res) => res.json())
      .then((data) => {

        setUser(data.user)
        setLoading(false)
      }) .catch((error) => {
        console.error("Error fetching user data:", error);
        setLoading(false);
      });
  }, [])
 
  if (isLoading) return <p>Loading...</p>



  return (
    <div className="flex gap-5 items-center justify-center">
    {user.length > 0 ? (
        user.map((user, index) => (
          <UserCard
            key={index}
            name={user.username}
            id={user.id}
            email={user.email}
            role={user.role}
          />
        ))
    ): (<div><p>No profile data</p></div>)}
    </div>
  );
}
