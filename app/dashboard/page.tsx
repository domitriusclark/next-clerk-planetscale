import Navbar from "@/components/navbar";
import { currentUser } from "@clerk/nextjs";

export default async function Dashboard() {
  const user = await currentUser();

  if (!user) {
    return;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isLoggedIn={user && true} />
    </div>
  );
}
