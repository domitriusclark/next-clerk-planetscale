"use client";

import { UploadButton } from "@/lib/utils";

export default function EventForm() {
  return (
    <main className="flex flex-col items-center justify-between min-h-screen p-24">
      <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          // Do something with the response
          console.log("Files: ", res);
          alert("Upload Completed");
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
      />
    </main>
  );
}
