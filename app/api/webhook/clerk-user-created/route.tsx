import type { WebhookEvent } from "@clerk/clerk-sdk-node";

import db from "@/lib/database";

export async function POST(req: Request) {
  const { data, type } = (await req.json()) as WebhookEvent;

  if (type !== "user.created") {
    return new Response("Needs to be the user.created event", {
      status: 500,
    });
  }

  const user = {
    id: data.id,
    email: data.email_addresses[0].email_address,
    name: data.first_name,
  };

  await db.insertInto("users").values(user).execute();

  return new Response("User created in planetscale 🥳", {
    status: 201,
  });
}
