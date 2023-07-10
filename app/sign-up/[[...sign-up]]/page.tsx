import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="flex items-center justify-center w-screen h-screen">
      <SignUp />
    </main>
  )
};