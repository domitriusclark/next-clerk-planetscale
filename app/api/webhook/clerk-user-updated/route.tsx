import type { WebhookEvent } from "@clerk/clerk-sdk-node";

import db from "@/lib/database";

export async function POST(req: Request) {
  const { data, type } = (await req.json()) as WebhookEvent;

  if (type !== "user.updated") {
    return new Response("Needs to be the user.created event", {
      status: 500,
    });
  }

  const user = {
    id: data.id,
    email: data.email_addresses[0].email_address,
    name: data.first_name + " " + data.last_name,
  };

  await db
    .updateTable("users")
    .set({
      email: user.email,
      name: user.name,
    })
    .where("id", "=", user.id)
    .execute();

  return new Response("User updated in planetscale 🥳", {
    status: 200,
  });
}
