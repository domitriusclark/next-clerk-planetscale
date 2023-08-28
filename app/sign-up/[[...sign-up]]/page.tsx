import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <span className="flex items-center justify-center w-screen h-screen">
      <SignUp />
    </span>
  );
}
