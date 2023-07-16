import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

type Props = {
  isLoggedIn: boolean;
};

export default function Navbar({ isLoggedIn }: Props) {
  return (
    <nav className="flex flex-col items-center pt-10 pr-10 text-white">
      <div className="flex self-end gap-10">
        <Link
          className="px-2 py-3 mb-8 text-sm text-white bg-blue-600 rounded-lg"
          href="/dashboard/create-event"
        >
          Create Event
        </Link>
        <Link href={isLoggedIn ? "/dashboard" : "/"}>Home </Link>
        {isLoggedIn ? (
          <UserButton afterSignOutUrl="/" />
        ) : (
          <Link href="/sign-in">Sign In</Link>
        )}
      </div>
    </nav>
  );
}
