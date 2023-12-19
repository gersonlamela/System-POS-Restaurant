import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/card";


interface UserCardProps {
  name: string;
  id: string;
  email: string; 
  role: string;
}

export default function UserCard(user:UserCardProps) {
 return(
  <Card>
  <CardHeader>
    <CardTitle>{user.name}</CardTitle>
    <CardDescription>{user.id}</CardDescription>
  </CardHeader>
  <CardContent>
    <p>{user.email}</p>
  </CardContent>
  <CardFooter>
    <p>{user.role}</p>
  </CardFooter>
 </Card>
 )

}