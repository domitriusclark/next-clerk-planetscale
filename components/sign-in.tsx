"use client";

import { useTheme } from "next-themes";

import { SignIn as SignInComponent } from "@clerk/nextjs";

export default function SignIn() {
  return <SignInComponent afterSignInUrl="/dashboard" />;
}
