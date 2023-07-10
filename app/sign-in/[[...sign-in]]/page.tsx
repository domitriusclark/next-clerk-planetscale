import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="flex items-center justify-center w-screen h-screen">
        <SignIn />;
    </main>
  )
}