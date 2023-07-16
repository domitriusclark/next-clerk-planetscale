import Navbar from "@/components/navbar";
import { currentUser } from "@clerk/nextjs";

export default async function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Navbar isLoggedIn={false} />
    </main>
  );
}
