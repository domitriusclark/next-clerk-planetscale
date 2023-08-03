import EventForm from "@/components/event-form";

export default async function CreateEventPage() {
  return (
    <main className="flex flex-col h-screen overflow-auto">
      <EventForm />
    </main>
  );
}
