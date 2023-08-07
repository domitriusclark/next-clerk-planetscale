import Link from "next/link";
import { UserButton, auth } from "@clerk/nextjs";
import { ModeToggle } from "./theme-toggle";

export default function Navbar() {
  const { sessionId } = auth();

  return (
    <nav className="flex justify-between h-16 px-8 border-b-2 border-slate-600 ">
      <div className="flex items-center gap-6">
        <Link href="/">Home</Link>
        {sessionId ? (
          <>
            <Link href="/dashboard">Dashboard</Link>

            <Link
              className="flex items-center h-10 px-2 text-sm rounded-md bg-primary hover:bg-primary/90 "
              href="/dashboard/event/create-event"
            >
              Create Event
            </Link>
          </>
        ) : (
          <Link href="/sign-in">Sign In</Link>
        )}
      </div>
      <div className="flex items-center h-full gap-6 ">
        <ModeToggle />
        <UserButton afterSignOutUrl="/" />
      </div>
    </nav>
  );
}
