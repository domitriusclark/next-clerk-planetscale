import { type ClassValue, clsx } from "clsx"
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { twMerge } from "tailwind-merge"
import { generateComponents } from "@uploadthing/react";
 
export const { UploadButton, UploadDropzone, Uploader } =
  generateComponents<OurFileRouter>();
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


