import type { WebhookEvent } from "@clerk/clerk-sdk-node";

export async function POST(req: Request) {
  const eventData = req.json();

  console.log({ eventData });

  return new Response("OK");
}
