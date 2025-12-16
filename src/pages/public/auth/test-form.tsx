"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/shared/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { TimePicker } from "@/shared/ui/time-picker"; // Import our new component
import { toast } from "sonner";

// Use z.string() and add a regex for time validation
const formSchema = z.object({
  meetingTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format. Use HH:mm"),
  eventTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, "Invalid time format. Use HH:mm:ss"),
});

type ProfileFormValues = z.infer<typeof formSchema>;

export function ProfileForm() {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      meetingTime: "14:30",
      eventTime: "09:00:00"
    }
  });


  function onSubmit(data: ProfileFormValues) {
    toast("You submitted the following values");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Example 1: 12-Hour format without seconds */}
        <FormField
          control={form.control}
          name="meetingTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meeting Time (12-Hour)</FormLabel>
              <FormControl>
                <TimePicker 
                  value={field.value}
                  onChange={field.onChange}
                  use12Hour={true}
                />
              </FormControl>
              <FormDescription>Select a time for the meeting.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Example 2: 24-Hour format with seconds */}
        <FormField
          control={form.control}
          name="eventTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Start Time (24-Hour with Seconds)</FormLabel>
              <FormControl>
                <TimePicker 
                  value={field.value}
                  onChange={field.onChange}
                  showSeconds={true}
                />
              </FormControl>
              <FormDescription>Set a precise start time for the event.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}