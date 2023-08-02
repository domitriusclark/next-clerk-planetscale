import type { Event } from "@/kysely.codegen";

import { auth } from "@clerk/nextjs";
import pscale from "@/lib/database";

import Navbar from "@/components/navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export async function getAllEvents() {
  const events = await pscale
    .selectFrom("event")
    .orderBy("created_at", "desc")
    .selectAll()
    .execute();

  return events;
}

function EventCard({ event }: { event: Event }) {
  return (
    <Card key={event.id}>
      <CardHeader>
        <CardTitle>{event.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{event.description}</CardDescription>
        {event.eventMode === ""}
      </CardContent>
      <CardFooter>
        <p>Event Footer</p>
      </CardFooter>
    </Card>
  );
}

export default async function Dashboard() {
  const { sessionId } = auth();

  const events = await getAllEvents();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isSignedIn={sessionId ? true : false} />

      <div className="flex flex-col items-center flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col justify-center gap-3">
            {events.map((event) => (
              <EventCard event={event} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
