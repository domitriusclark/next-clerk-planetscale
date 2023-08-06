"use client";

import type { Event } from "@/kysely.codegen";
import { useRouter } from "next/navigation";

import { deleteEvent } from "@/lib/actions";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  event: Omit<Event, "id" | "created_at"> & {
    id: number;
    created_at: Date | null;
  };
  userId: string;
}) {
  const router = useRouter();
  return (
    <Card className="w-full text-white bg-black md:w-2/3 xl:w-1/4 h-60">
      <CardHeader>
        <CardTitle>{event.name}</CardTitle>
        <CardDescription>{event.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {event.event_mode && <EventLocation eventMode={event.event_mode} />}
        <p>
          When: {event.date && new Date(event.date).toLocaleDateString("en-US")}
        </p>
      </CardContent>
      <CardFooter className="flex justify-end gap-3">
        {event.user_id === userId && (
          <>
            <Button
              onClick={() => router.push(`/dashboard/edit-event/${event.id}`)}
            >
              <Pencil color="yellow" />
            </Button>
            <Button onClick={async () => await deleteEvent(event.id)}>
              <Trash2 color="red" />
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
