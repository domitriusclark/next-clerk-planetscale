"use client";

import type { Event } from "@/kysely.codegen";
import { useRouter } from "next/navigation";

import { deleteEvent } from "@/lib/actions";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Selectable } from "kysely";

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

export default function EventCard({
  event,
  userId,
}: {
  event: Selectable<Event>;
  userId: string;
}) {
  const router = useRouter();
  return (
    <Card className="w-full md:w-2/5 lg:w-2/4 xl:w-1/4 h-60">
      <CardHeader>
        <Link href={`/dashboard/event/${event.id}`}>
          <CardTitle>{event.name}</CardTitle>
        </Link>
        <CardDescription>{event.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {event.event_mode && <EventLocation eventMode={event.event_mode} />}
        <p>
          When: {event.date && new Date(event.date).toLocaleDateString("en-US")}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        {event.user_id === userId && (
          <>
            <Button
              onClick={() =>
                router.push(`/dashboard/event/edit-event/${event.id}`)
              }
            >
              Edit
            </Button>
            <Button onClick={async () => await deleteEvent(event.id)}>
              Delete
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
