
import { auth } from "@/auth";
import SignOutButton from "@/components/signOut-button";


export default async function UserDashboard() {
  const session = await auth();

  if (session?.user){
    <div>
        {" "}
        <h1>Hello you are signed in!</h1>
        <p> User signed in with name: {session.user.name} </p>
        <p> User signed in with name: {session.user.email} </p>
        <SignOutButton />
    </div>
  }

  return (
    <div>
        Hello
    </div>
  )
}
