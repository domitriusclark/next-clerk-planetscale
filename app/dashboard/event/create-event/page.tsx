import EventForm from "@/components/event-form";

export default async function CreateEventPage() {
  return (
    <>
      <section className="w-1/2">
        <EventForm />
      </section>
      <section className="w-1/2"></section>
    </>
  );
}
