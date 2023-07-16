"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
import { createEvent } from "@/lib/actions";
import { UploadButton } from "@uploadthing/react";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  description: z.string(),
  date: z.date({
    required_error: "Please select a date",
  }),
  eventMode: z.string(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipcode: z.string().optional(),
  url: z.string().optional(),
});

export default function EventForm() {
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

  // 2. Define a submit handler.
  async function onSubmit(values: Partial<z.infer<typeof formSchema>>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    if (!values) {
      return;
    }
    await createEvent(values);
  }

  const eventMode = watch("eventMode");

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`p-10 w-1/3 space-y-8 text-cyan-500 border-2 rounded-3xl border-slate-300 ${
          eventMode === "both" && "my-[48px] "
        }`}
      >
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Reactadelphia meetup in Philly"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                What's your events name? Make it unique!
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of birth</FormLabel>
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

        <FormField
          control={control}
          name="eventMode"
          render={({ field }) => {
            return (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
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

        {eventMode === "in-person" && (
          <>
            <FormField
              control={control}
              name="address"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Street address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="1600 Amphitheatre Parkway"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The street your event will be held on
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
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
            <FormField
              control={control}
              name="zipcode"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input placeholder="94043" {...field} />
                    </FormControl>
                    <FormDescription>
                      Zipcode of your event's location
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </>
        )}

        {eventMode === "remote" && (
          <FormField
            control={control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://twitch.tv/reactadelphia"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  The URL your event is being held at
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {eventMode === "both" && (
          <>
            <FormField
              control={control}
              name="address"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Street address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="1600 Amphitheatre Parkway"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The street your event will be held on
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
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
            <FormField
              control={control}
              name="zipcode"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input placeholder="94043" {...field} />
                    </FormControl>
                    <FormDescription>
                      Zipcode of your event's location
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://twitch.tv/reactadelphia"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The URL your event is being held at
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
