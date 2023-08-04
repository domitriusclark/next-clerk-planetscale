import type { Event } from "@/kysely.codegen";

import pscale from "@/lib/database";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

async function getAllEvents() {
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
    default:
      return "in-person";
  }
}

function EventCard({
  event,
}: {
  event: Omit<Event, "id" | "created_at"> & {
    id: number;
    created_at: Date | null;
  };
}) {
  return (
    <Card className="w-full text-white bg-black md:w-2/3 xl:w-1/4 h-60">
      <CardHeader>
        <CardTitle>{event.name}</CardTitle>
        <CardDescription>{event.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {event.event_mode && <EventLocation eventMode={event.event_mode} />}
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
  const events = await getAllEvents();

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-wrap justify-center gap-6 p-8">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
