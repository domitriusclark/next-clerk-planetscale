import type { WebhookEvent } from "@clerk/clerk-sdk-node";

export async function POST(req: Request) {
  if (req.headers.get("x-clerk-webhook-event") === "user.created") {
    const eventData = req.body;

    console.log(eventData);

    // Handle the user.created event
    // Your custom logic here

    return new Response("User created event processed successfully");
  }

  return new Response("OK");
}
