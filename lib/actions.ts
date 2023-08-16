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

export async function deleteAndReplaceCoverImage(
  fileToDelete: string,
  fileToReplace: string,
  fileName: string
) {
  try {
    await utapi.deleteFiles(fileToDelete);

    return await uploadImage(fileToReplace, fileName);
  } catch (e) {
    console.log(e);
    return { message: e };
  }
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
  newImage?: string,
  fileName?: string
) {
  const { userId } = auth();

  if (!userId) {
    return;
  }

  let image: string;

  if (newImage && fileName && event.cover_image) {
    const replacedImage = await deleteAndReplaceCoverImage(
      event.cover_image,
      newImage,
      fileName
    );

    if (replacedImage === typeof "string") {
      image = replacedImage;

      try {
        await pscale
          .updateTable("event")
          .set({ ...event, cover_image: image })
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
  }

  redirect("/dashboard");
}
