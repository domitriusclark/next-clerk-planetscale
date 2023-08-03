"use server";

import pscale from "@/lib/database";
import { Event } from "@/kysely.codegen";
import { auth } from "@clerk/nextjs";

export async function createEvent(
  event: Omit<Event, "id" | "user_id" | "created_at">
) {
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
      .values({ ...event, user_id: userId })
      .execute();

    return;
  } catch (e) {
    console.log(e);
    return;
  }
}

export async function deleteEvent(eventId: number) {
  try {
    await pscale.deleteFrom("event").where("id", "=", eventId).execute();

    return { message: "Event deleted successfully" };
  } catch (e) {
    console.log(e);
    return { message: e };
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
