import EventForm from "@/components/event-form";
import Navbar from "@/components/navbar";
import { auth } from "@clerk/nextjs";

export default async function CreateEventPage() {
  const { sessionId } = auth();

  return (
    <main className="flex flex-col h-screen overflow-auto">
      <Navbar isSignedIn={sessionId ? true : false} />

      <EventForm />
    </main>
  );
}
