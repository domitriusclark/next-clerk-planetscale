import Link from "next/link";
import { UserButton, auth } from "@clerk/nextjs";

export default function Navbar() {
  const { sessionId } = auth();

  return (
    <nav className="flex flex-col h-20 text-white ">
      <div className="flex items-center self-end h-full gap-10 pr-5">
        <Link
          className="flex items-center h-12 px-2 text-sm text-white bg-blue-600 rounded-lg "
          href="/dashboard/create-event"
        >
          Create Event
        </Link>
        <Link href="/">Home</Link>
        {sessionId ? (
          <>
            <Link href="/dashboard">Dashboard</Link>

            <UserButton afterSignOutUrl="/" />
          </>
        ) : (
          <Link href="/sign-in">Sign In</Link>
        )}
      </div>
    </nav>
  );
}
