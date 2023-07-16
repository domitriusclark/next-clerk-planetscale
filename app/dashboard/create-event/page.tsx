import EventForm from "@/components/event-form";
import Navbar from "@/components/navbar";
import { currentUser } from "@clerk/nextjs";

export default async function CreateEventPage() {
  const user = await currentUser();

  if (!user) {
    return;
  }

  return (
    <main className="flex flex-col h-screen overflow-auto">
      <Navbar isLoggedIn={user && true} />
      <div className="flex flex-col w-full h-full">
        <EventForm />
      </div>
    </main>
  );
}
