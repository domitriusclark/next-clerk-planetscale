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

  try {
    await pscale
      .insertInto("event")
      .values({
        ...event,
        user_id: userId,
        created_at: new Date(),
      })
      .execute();

    return { message: "Event created successfully" };
  } catch (e) {
    console.log(e);
    // @ts-expect-error
    return { message: e.message };
  }
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
