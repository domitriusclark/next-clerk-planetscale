import "./globals.css";
import "@uploadthing/react/styles.css";
import type { Metadata } from "next";
import { dark } from "@clerk/themes";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Clerk Events App",
  description: "Manage events & discover new ones.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en">
        <body className=" bg-stone-950">{children}</body>
      </html>
    </ClerkProvider>
  );
}
