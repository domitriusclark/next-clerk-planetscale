import Navbar from "@/components/navbar";
import { currentUser } from "@clerk/nextjs";
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

  const user = await currentUser();

  if (!user) {
    return;
  }

  const id = user.id;

  const planetscaleUser = await findPlanetscaleUser(id);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isLoggedIn={user && true} />

      <div className="flex flex-col items-center flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col justify-center gap-3">
            <h1 className="text-3xl font-extrabold text-white">
              Welcome to your dashboard, {planetscaleUser?.name}!
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              You are logged in as {planetscaleUser?.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
