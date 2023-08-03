"use client";

import { createEvent } from "@/lib/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm, Control } from "react-hook-form";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import type { Event } from "@/kysely.codegen";

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

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  description: z.string(),
  date: z.date({
    required_error: "Please select a date",
  }),
  event_mode: z.string(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipcode: z.string().optional(),
  url: z.string().optional(),
});

export default function EventForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = form;

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
    } satisfies Omit<Event, "id" | "user_id" | "created_at">;

    await createEvent(event);

    router.push("/dashboard");
  }

  const eventMode = watch("event_mode");

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`p-10 w-3/4 space-y-8 self-center text-black  rounded-3xl border-slate-300 overflow-scroll`}
      >
        <EventInputField control={control} />
        <DatePickerField control={control} />
        <EventModeSelectField control={control} />
        <DescriptionTextareaField control={control} />

        {eventMode === "in-person" && (
          <>
            <AddressInputField control={control} />
            <CityInputField control={control} />
            <ZipcodeInputField control={control} />
          </>
        )}

        {eventMode === "remote" && <RemoteUrlInputField control={control} />}

        {eventMode === "both" && (
          <>
            <AddressInputField control={control} />
            <CityInputField control={control} />
            <ZipcodeInputField control={control} />
            <RemoteUrlInputField control={control} />
          </>
        )}

        <Button type="submit">Submit</Button>
      </form>
    </Form>
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
            <Input placeholder="Reactadelphia meetup in Philly" {...field} />
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
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
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
}: {
  control: Control<z.infer<typeof formSchema>>;
}) {
  return (
    <FormField
      control={control}
      name="event_mode"
      render={({ field }) => {
        return (
          <FormItem>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
