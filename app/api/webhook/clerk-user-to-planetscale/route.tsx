import type { WebhookEvent } from "@clerk/clerk-sdk-node";

export async function POST(req: Request, event: Event) {
  console.log(req.body);
  console.log(req.headers);
  console.log(event);

  return new Response("OK");
}
