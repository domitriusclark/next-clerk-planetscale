import type { Event, Generated } from "@/kysely.codegen";
import { Selectable } from "kysely";

import pscale from "@/lib/database";
import { redirect } from "next/navigation";

function EventLocation({
  event,
  event_mode,
}: {
  event: Selectable<Event>;
  event_mode: string;
}) {
  switch (event_mode) {
    case "remote":
      return <p>{event.url}</p>;
    case "in_person":
      return <p>{event.address}</p>;
    case "both":
      return (
        <>
          <p>{event.url}</p>
          <p>{event.address}</p>
        </>
      );
  }
}

export default async function EventPage({
  params,
}: {
  params: { id: string };
}) {
  console.log(params);
  const event = await pscale
    .selectFrom("event")
    .selectAll()
    .where("id", "=", Number(params.id))
    .executeTakeFirst();

  if (!event) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      {event.cover_image && (
        <img
          className="w-1/3"
          src={event.cover_image}
          alt={`Cover image for ${event.name}`}
        />
      )}
      <h1 className="font-bold">{event.name}</h1>

      <p>{event.description}</p>
      <p>{event.event_mode}</p>

      <EventLocation event={event} event_mode={String(event.event_mode)} />
    </div>
  );
}
