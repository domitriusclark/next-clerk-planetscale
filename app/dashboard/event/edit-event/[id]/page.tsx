import EventForm from "@/app/dashboard/event/event-form";
import pscale from "@/lib/database";
import { redirect } from "next/navigation";

export default async function EditEventForm({
  params,
}: {
  params: { id: string };
}) {
  const eventId = Number(params.id);
  const event = await pscale
    .selectFrom("event")
    .selectAll()
    .where("id", "=", eventId)
    .executeTakeFirst();

  if (!event) {
    redirect("/dashboard");
  }

  return <EventForm editableValues={event} eventId={eventId} />;
}
