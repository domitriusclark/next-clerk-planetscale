import EventForm from "@/components/event-form";
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

  return (
    <>
      <section className="w-1/2">
        <EventForm editableValues={event} eventId={eventId} />
      </section>
      <section className="w-1/2"></section>
    </>
  );
}
