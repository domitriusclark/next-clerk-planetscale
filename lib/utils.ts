import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isString = (value: any): value is string => {
  return typeof value === "string";
};

export const isDarkMode = (
  theme: string | undefined,
  resolvedTheme: string | undefined
) => {
  if (isString(theme) && isString(resolvedTheme)) {
    if (theme === "dark" || resolvedTheme === "dark") {
      return true;
    }
  }

  return false;
};
