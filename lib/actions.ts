"use server";

import pscale from "@/lib/database";
import { Event } from "@/kysely.codegen";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export async function createEvent(event: Partial<Event>) {
  const { userId } = auth();

  if (!userId) {
    return;
  }

  if (!event) {
    return;
  }

  await pscale
    .insertInto("event")
    .values({
      ...event,
      user_id: userId,
      created_at: new Date(),
    })
    .execute();

  return redirect("/dashboard");
}

export async function findPlanetscaleUser(userId: string) {
  "use server";

  const user = await pscale
    .selectFrom("user")
    .where("id", "=", userId)
    .selectAll()
    .executeTakeFirst();

  return user;
}
