import Navbar from "@/components/navbar";
import { auth } from "@clerk/nextjs";

export default async function Home() {
  const { sessionId } = auth();

  return (
    <main className="flex flex-col min-h-screen">
      <Navbar isSignedIn={sessionId ? true : false} />
    </main>
  );
}
