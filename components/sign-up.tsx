"use client";

import { useTheme } from "next-themes";
import { SignUp as SignUpComponent } from "@clerk/nextjs";

export default function SignUp() {
  return <SignUpComponent afterSignUpUrl="/dashboard" />;
}
