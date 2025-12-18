import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "../../lib";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover,  PopoverContent,
  PopoverTrigger, } from "./popover";
"use client";


export type DateFormatOption =
  | "PPP" // Dec 16, 2025
  | "yyyy-MM-dd" // 2025-12-16
  | "dd-MM-yyyy" // 16-12-2025
  | "MM/dd/yyyy"; // 12/16/2025

// Define the props for the DatePicker component
interface DatePickerProps {
  value?: Date;
  // Use the non-deprecated type for the onSelect event handler
   onSelect: (date: Date | undefined) => void;
  className?: string;
  // Use our custom type for type-safe formats
  dateFormat?: DateFormatOption;
  // 3. Add a placeholder prop
  placeholder?: string;
}

export function DatePicker({
  value,
  onSelect,
  className,
  dateFormat = "PPP",
  placeholder = "Pick a date",
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-60 justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, dateFormat) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}