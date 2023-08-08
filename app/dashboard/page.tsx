import pscale from "@/lib/database";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import EventCard from "@/components/event-card";

async function getAllEvents() {
  const events = await pscale
    .selectFrom("event")
    .orderBy("created_at", "desc")
    .selectAll()
    .execute();

  return events;
}

export default async function Dashboard() {
  const events = await getAllEvents();
  const { userId } = auth();

  if (!userId) {
    redirect("/");
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-wrap justify-start gap-6 p-8 ml-4">
        {events.map((event) => (
          <EventCard key={event.id} userId={userId} event={event} />
        ))}
      </div>
    </div>
  );
}
