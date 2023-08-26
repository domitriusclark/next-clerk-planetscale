"use server";

import pscale from "@/lib/database";
import { Event } from "@/kysely.codegen";
import { auth } from "@clerk/nextjs";
import { utapi } from "uploadthing/server";
import { redirect } from "next/navigation";
import { Updateable, Insertable } from "kysely";
import { revalidatePath } from "next/cache";

export async function uploadImage(imageUrl: string, fileName: string) {
  async function dataUrlToFile(
    dataUrl: string,
    fileName: string
  ): Promise<File> {
    const res: Response = await fetch(dataUrl);
    const blob: Blob = await res.blob();
    return new File([blob], fileName, { type: "image/png" });
  }

  const file = await dataUrlToFile(imageUrl, fileName);

  const response = await utapi.uploadFiles(file);

  return response.data?.url;
}

export async function createEvent(
  event: Omit<Insertable<Event>, "user_id">,
  image: string,
  fileName: string
) {
  const { userId } = auth();

  if (!userId) {
    return;
  }

  if (!event) {
    return;
  }

  const imageUrl = await uploadImage(image, fileName);

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

export async function deleteCoverImage(fileToDelete: string, eventId: number) {
  try {
    // Pull the fileKey from the URL to pass to UploadThing
    const fileKey = fileToDelete.split("/f/")[1];
    const deleteFromUT = await utapi.deleteFiles(fileKey);
    if (deleteFromUT.success === true) {
      await pscale
        .updateTable("event")
        .set({ cover_image: null })
        .where("id", "=", eventId)
        .executeTakeFirst();
    } else {
      return { message: "Failed to delete image" };
    }
  } catch (e) {
    console.log(e);
    return { message: e };
  }

  revalidatePath(`/dashboard/event/edit-event/${eventId}`);
}

export async function deleteEvent(eventId: number) {
  const { userId } = auth();

  if (!userId) {
    return;
  }

  try {
    await pscale.deleteFrom("event").where("id", "=", eventId).execute();
  } catch (e) {
    console.log(e);
    return { message: e };
  }

  revalidatePath("/dashboard");
}

export async function updateEvent(
  eventId: number,
  event: Updateable<Event>,
  image?: string,
  fileName?: string
) {
  const { userId } = auth();

  if (!userId) {
    return;
  }

  let imageUrl;

  if (image && fileName) {
    imageUrl = await uploadImage(image, fileName);

    try {
      await pscale
        .updateTable("event")
        .set({ ...event, cover_image: imageUrl })
        .where("id", "=", eventId)
        .executeTakeFirst();

      console.log("Updated Event");
    } catch (e) {
      console.log(e);
      return { message: e };
    }
  } else {
    try {
      await pscale
        .updateTable("event")
        .set(event)
        .where("id", "=", eventId)
        .executeTakeFirst();

      console.log("Updated Event");
    } catch (e) {
      console.log(e);
      return { message: e };
    }
  }

  redirect("/dashboard");
}
