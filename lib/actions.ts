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
      user_id: userId,
      ...event,
    })
    .execute();

  redirect("/dashboard");
}
