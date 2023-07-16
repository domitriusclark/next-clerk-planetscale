"use server";

import pscale from "@/lib/database";
import { Event } from "@/kysely.codegen";
import { auth } from "@clerk/nextjs";

export async function createEvent(event: Partial<Event>) {
  const { userId } = auth();

  if (!userId) {
    return;
  }

  if (!event) {
    return;
  }

  const newEvent = await pscale
    .insertInto("event")
    .values({
      user_id: userId,
      ...event,
    })
    .execute();

  return;
}
