"use client";
import type { Event } from "@/kysely.codegen";

import * as React from "react";
import { createEvent, updateEvent, deleteCoverImage } from "@/lib/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm, Control, FieldPath } from "react-hook-form";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useController } from "react-hook-form";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Selectable } from "kysely";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  description: z.string(),
  date: z.date({
    required_error: "Please select a date",
  }),
  cover_image: z.instanceof(File).or(z.string()),
  event_mode: z.string(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipcode: z.string().optional(),
  url: z.string().optional(),
});

function getBase64(file: File): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

export default function EventForm({
  editableValues,
  eventId,
}: {
  editableValues?: Selectable<Event>;
  eventId?: number;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  React.useEffect(() => {
    // This makes it so that the empty input values are not set to null on edit
    if (editableValues) {
      const formValuesWithoutNull = Object.fromEntries(
        Object.entries(editableValues).filter(([_, value]) => value !== null)
      );
      form.reset((formValues) => ({
        ...formValues,
        ...formValuesWithoutNull,
      }));
    }
  }, [editableValues, form.reset]);

  const { handleSubmit, control, watch } = form;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!values) {
      return;
    }

    const event = {
      name: values.name,
      description: values.description,
      date: values.date ? new Date(values.date) : null,
      event_mode: values.event_mode,
      address: values.address ? values.address : null,
      city: values.city ? values.city : null,
      state: values.state ? values.state : null,
      zipcode: values.zipcode ? values.zipcode : null,
      url: values.url ? values.url : null,
    };

    if (editableValues) {
      const id = Number(eventId);
      if (values.cover_image instanceof File) {
        await updateEvent(
          id,
          event,
          await getBase64(values.cover_image),
          values.cover_image.name
        );
      } else {
        await updateEvent(id, {
          ...event,
          cover_image: editableValues.cover_image,
        });
      }
    } else if (values.cover_image instanceof File) {
      await createEvent(
        event,
        await getBase64(values.cover_image),
        values.cover_image.name
      );
    }
  }

  const eventMode = watch("event_mode");

  return (
    <div className="flex w-full h-full">
      <section className="flex flex-col items-center w-1/2 overflow-scroll">
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={`w-2/3 mt-16 space-y-6 ${
              editableValues ? "mb-10" : ""
            } `}
          >
            <EventInputField control={control} />
            <DatePickerField control={control} />
            <ImageInputField
              control={control}
              name="cover_image"
              imageUrl={
                editableValues && editableValues.cover_image !== null
                  ? editableValues.cover_image
                  : ""
              }
              hasEditableValues={editableValues ? true : false}
              eventId={eventId}
            />
            <EventModeSelectField
              control={control}
              editableValues={editableValues}
            />
            <DescriptionTextareaField control={control} />

            {eventMode === "in-person" && (
              <>
                <AddressInputField control={control} />
                <CityInputField control={control} />
                <ZipcodeInputField control={control} />
              </>
            )}

            {eventMode === "remote" && (
              <RemoteUrlInputField control={control} />
            )}

            {eventMode === "both" && (
              <>
                <AddressInputField control={control} />
                <CityInputField control={control} />
                <ZipcodeInputField control={control} />
                <RemoteUrlInputField control={control} />
              </>
            )}

            <Button type="submit">{editableValues ? "Save" : "Create"}</Button>
          </form>
        </Form>
      </section>
      <section className="w-1/2">
        <EventPreview values={form.getValues()} />
      </section>
    </div>
  );
}

function EventPreview({ values }: { values: z.infer<typeof formSchema> }) {
  const { name, description, date, event_mode, address, url } = values;

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4 space-y-4 text-center border-l-2 border-slate-200">
      <h1 className="text-3xl font-bold">{name}</h1>
      <p className="text-lg">{description}</p>
      <p className="text-lg">
        {date && format(new Date(date), "MMMM do, yyyy")}
      </p>
      <p className="text-lg">{event_mode}</p>
      {address && <p className="text-lg">{address}</p>}
      {url && <p className="text-lg">{url}</p>}
    </div>
  );
}

function ImageInputField({
  control,
  name,
  imageUrl,
  hasEditableValues,
  eventId,
}: {
  control: Control<z.infer<typeof formSchema>>;
  name: FieldPath<z.infer<typeof formSchema>>;
  imageUrl?: string;
  hasEditableValues?: boolean;
  eventId?: number;
}) {
  const { field } = useController({ name, control });
  const [image, setImage] = React.useState(imageUrl ? imageUrl : "");

  const onCoverImageChange = React.useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files?.[0]) {
        const base64 = await getBase64(event.target.files[0]);

        setImage(base64);
        field.onChange(event.target.files[0]);
      }
    },
    []
  );

  async function onDeleteImage() {
    if (!eventId) {
      return;
    }

    await deleteCoverImage(image, eventId);
    setImage("");
  }

  return (
    <div className="flex flex-col">
      <Label className="mb-2">Banner Image</Label>
      <Input type="file" onChange={onCoverImageChange} />
      {image && <img src={image} className="w-2/3 mt-5 rounded-md " />}
      {hasEditableValues && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            {image && (
              <Button className="mt-4" onClick={() => onDeleteImage()}>
                Delete
              </Button>
            )}
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to delete your image?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                cover image.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}

function EventInputField({
  control,
}: {
  control: Control<z.infer<typeof formSchema>>;
}) {
  return (
    <FormField
      control={control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Event name</FormLabel>
          <FormControl>
            <Input {...field} placeholder="Reactadelphia meetup in Philly" />
          </FormControl>
          <FormDescription>
            What's your events name? Make it unique!
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function DatePickerField({
  control,
}: {
  control: Control<z.infer<typeof formSchema>>;
}) {
  return (
    <FormField
      control={control}
      name="date"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Event Date</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    format(field.value, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="w-4 h-4 ml-auto opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                /* @ts-ignore */
                onSelect={field.onChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function EventModeSelectField({
  control,
  editableValues,
}: {
  control: Control<z.infer<typeof formSchema>>;
  editableValues?: Selectable<Event>;
}) {
  return (
    <FormField
      control={control}
      name="event_mode"
      render={({ field }) => {
        const defaultEventMode =
          editableValues && typeof editableValues.event_mode === "string"
            ? editableValues.event_mode
            : field.value;
        return (
          <FormItem>
            <Select
              onValueChange={field.onChange}
              defaultValue={defaultEventMode}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select your event location" />
                </SelectTrigger>
              </FormControl>
              <SelectContent defaultValue="in-person">
                <SelectItem value="in-person">In person</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="both">Both</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              Is your event in person, remote, or both?
            </FormDescription>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

function DescriptionTextareaField({
  control,
}: {
  control: Control<z.infer<typeof formSchema>>;
}) {
  return (
    <FormField
      control={control}
      name="description"
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Today we're going to learn about building React Server Components..."
              />
            </FormControl>
          </FormItem>
        );
      }}
    />
  );
}

function AddressInputField({
  control,
}: {
  control: Control<z.infer<typeof formSchema>>;
}) {
  return (
    <FormField
      control={control}
      name="address"
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel>Street address</FormLabel>
            <FormControl>
              <Input placeholder="1600 Amphitheatre Parkway" {...field} />
            </FormControl>
            <FormDescription>
              The street your event will be held on
            </FormDescription>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

function CityInputField({
  control,
}: {
  control: Control<z.infer<typeof formSchema>>;
}) {
  return (
    <FormField
      control={control}
      name="city"
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel>State</FormLabel>
            <FormControl>
              <Input placeholder="California" {...field} />
            </FormControl>
            <FormDescription>The state your event's in</FormDescription>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

function ZipcodeInputField({
  control,
}: {
  control: Control<z.infer<typeof formSchema>>;
}) {
  return (
    <FormField
      control={control}
      name="zipcode"
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel>Zipcode</FormLabel>
            <FormControl>
              <Input placeholder="94043" {...field} />
            </FormControl>
            <FormDescription>Zipcode of your event's location</FormDescription>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

function RemoteUrlInputField({
  control,
}: {
  control: Control<z.infer<typeof formSchema>>;
}) {
  return (
    <FormField
      control={control}
      name="url"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Event URL</FormLabel>
          <FormControl>
            <Input placeholder="https://twitch.tv/reactadelphia" {...field} />
          </FormControl>
          <FormDescription>The URL your event is being held at</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
