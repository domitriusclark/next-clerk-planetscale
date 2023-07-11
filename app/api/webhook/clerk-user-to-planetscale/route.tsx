// import type { WebhookEvent } from "@clerk/clerk-sdk-node";

export async function POST(req: Request) {
  const event = req.body;

  console.log(event);

  return new Response("OK");
}
