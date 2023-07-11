import type { WebhookEvent } from "@clerk/clerk-sdk-node";

export async function POST(req: Request) {
  // @ts-expect-error
  const event = req.body?.event as WebhookEvent;

  console.log(event);

  return new Response("OK");
}
