import Navbar from "@/components/navbar";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import db from "@/lib/database";

export default async function Dashboard() {
  async function findPlanetscaleUser(userId: string) {
    const user = await db
      .selectFrom("user")
      .where("id", "=", userId)
      .selectAll()
      .executeTakeFirst();

    return user;
  }

  const { userId, sessionId } = auth();

  if (!userId) {
    redirect("/");
  }

  const planetscaleUser = await findPlanetscaleUser(userId);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isSignedIn={sessionId ? true : false} />

      <div className="flex flex-col items-center flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col justify-center gap-3"></div>
        </div>
      </div>
    </div>
  );
}
