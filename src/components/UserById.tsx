
interface userIdProps {
  userId:string
}

export async function getUserById(userIdProps: userIdProps) {
  const { userId } = userIdProps;

  const result = await fetch('http://localhost:3000/api/user/getUserById', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      userId
    })
  });

  if (result.ok) {
    return result.json();
  }

  return [];
}


export default async function UserById(userId:userIdProps) {
  const user = await getUserById(userId)
  
 return <div className="text-2xl w-full flex items-center justify-center"><h1>
  {user.user.username}</h1></div>;
}