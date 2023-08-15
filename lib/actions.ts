"use server";

import pscale from "@/lib/database";
import { Event } from "@/kysely.codegen";
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { utapi } from "uploadthing/server";
import { redirect } from "next/navigation";

export async function uploadImage(imageUrl: string) {
  async function dataUrlToFile(
    dataUrl: string,
    fileName: string
  ): Promise<File> {
    const res: Response = await fetch(dataUrl);
    const blob: Blob = await res.blob();
    return new File([blob], fileName, { type: "image/png" });
  }

  const file = await dataUrlToFile(imageUrl, "cover_image.png");

  const response = await utapi.uploadFiles(file);

  return response.data?.url;
}

export async function createEvent(
  event: Omit<Event, "id" | "user_id" | "created_at" | "cover_image">,
  image: string
) {
  const { userId } = auth();

  if (!userId) {
    return;
  }

  if (!event) {
    return;
  }

  const imageUrl = await uploadImage(image);

  console.log(imageUrl);

  try {
    await pscale
      .insertInto("event")
      .values({ ...event, user_id: userId, cover_image: imageUrl })
      .execute();
  } catch (e) {
    console.log(e);
    return;
  }
  redirect("/dashboard");
}

export async function deleteEvent(eventId: number) {
  const { userId } = auth();

  if (!userId) {
    return;
  }

  try {
    await pscale.deleteFrom("event").where("id", "=", eventId).execute();
    revalidatePath("/dashboard");
  } catch (e) {
    console.log(e);
    return { message: e };
  }
}

export async function updateEvent(
  eventId: number,
  event: Omit<Event, "id" | "user_id" | "created_at" | "cover_image">
) {
  const { userId } = auth();

  if (!userId) {
    return;
  }
  try {
    await pscale
      .updateTable("event")
      .set(event)
      .where("id", "=", eventId)
      .executeTakeFirst();

    console.log("Updated Event");
    redirect("/dashboard");
  } catch (e) {
    console.log(e);
    return { message: e };
  }
}
