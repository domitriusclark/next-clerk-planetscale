"use client";

import { UserButton as Button } from "@clerk/nextjs";
import { useTheme } from "next-themes";

export default function UserButton() {
  const { theme } = useTheme();

  const cardStyles = {
    card: "bg-background border border-black",
  };

  const popoverStyles = {
    userPreviewTextContainer: theme === "dark" ? "text-white" : "text-black",
    userPreviewSecondaryIdentifier:
      theme === "dark" ? "text-white" : "text-black",
    userButtonPopoverActionButtonText:
      theme === "dark" ? "text-white" : "text-black",
    userButtonPopoverActionButtonIcon:
      theme === "dark" ? "text-white" : "text-black",
    userButtonPopoverCard:
      theme === "dark"
        ? "bg-popover border border-white"
        : "bg-background border border-black",
    userButtonPopoverFooter: "text-white",
    userButtonPopoverActionButton: {
      "&:hover": {
        backgroundColor: "hsl(346.8 77.2% 49.8%)",
      },
    },
  };

  return (
    <Button
      afterSignOutUrl="/"
      appearance={{
        userProfile: {
          elements: cardStyles,
        },
        elements: popoverStyles,
      }}
    />
  );
}
