import type { WebhookEvent } from "@clerk/clerk-sdk-node";

import db from "@/lib/database";

export async function POST(req: Request) {
  const { data, type } = (await req.json()) as WebhookEvent;

  if (type !== "user.deleted") {
    return new Response("Needs to be the user.created event", {
      status: 500,
    });
  }

  if (!data.id) {
    return new Response("No user id found", {
      status: 500,
    });
  }

  await db.deleteFrom("user").where("id", "=", data.id).execute();

  return new Response("User updated in planetscale 🥳", {
    status: 200,
  });
}
