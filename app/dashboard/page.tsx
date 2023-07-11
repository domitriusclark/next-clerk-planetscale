import Navbar from "@/components/navbar";
import { currentUser } from "@clerk/nextjs";
import db from "@/lib/database";

export default async function Dashboard() {
  const user = await currentUser();

  if (!user) {
    return;
  }

  async function findPlanetscaleUser(userId: string) {
    const user = await db
      .selectFrom("users")
      .where("id", "=", userId)
      .selectAll()
      .executeTakeFirst();

    return user;
  }

  const id = user.id;

  const planetscaleUser = await findPlanetscaleUser(id);

  console.log(planetscaleUser);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isLoggedIn={user && true} />
    </div>
  );
}
