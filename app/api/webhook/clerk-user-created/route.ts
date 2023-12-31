import type { WebhookEvent } from "@clerk/clerk-sdk-node";

import pscale from "@/lib/database";
import { User } from "@/kysely.codegen";

export async function POST(req: Request) {
  const { data, type } = (await req.json()) as WebhookEvent;

  if (type !== "user.created") {
    return new Response("Needs to be the user.created event from Clerk", {
      status: 500,
    });
  }

  const user: User = {
    id: data.id,
    email: data.email_addresses[0].email_address,
    name:
      data.first_name.length > 0
        ? data.first_name
        : data.email_addresses[0].email_address,
  };

  await pscale.insertInto("user").values(user).execute();

  return new Response("User created in planetscale 🥳", {
    status: 201,
  });
}
