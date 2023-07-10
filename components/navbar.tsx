import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

type Props = {
  isLoggedIn: boolean;
};

export default function Navbar({ isLoggedIn }: Props) {
  return (
    <nav className="flex flex-col items-center pt-10 pr-10">
      <div className="flex self-end gap-10">
        <Link href="/">Home </Link>
        {isLoggedIn ? (
          <UserButton afterSignOutUrl="/" />
        ) : (
          <Link href="/sign-in">Sign In</Link>
        )}
      </div>
    </nav>
  );
}
