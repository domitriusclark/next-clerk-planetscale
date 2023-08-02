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

function EventLocation({ eventMode }: { eventMode: string }) {
  switch (eventMode) {
    case "remote":
      return <p>Remote</p>;
    case "in-person":
      return <p>In Person</p>;
    case "both":
      return <p>Both</p>;
  }
}

function EventCard({ event }: { event: Event }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{event.name}</CardTitle>
        <CardDescription>{event.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {event.eventMode && <EventLocation eventMode={event.eventMode} />}
      </CardContent>
      <CardFooter>
        <p>
          When: {event.date && new Date(event.date).toLocaleDateString("en-US")}
        </p>
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
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
