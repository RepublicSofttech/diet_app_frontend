"use client";

import * as React from "react";
import { cn } from "../lib";
import { Input } from "./input";
import { Button } from "./button";

interface TimePickerProps {
  value?: string; // Expects value in "HH:mm" or "HH:mm:ss" format
  onChange: (value: string) => void;
  className?: string;
  use12Hour?: boolean;
  showSeconds?: boolean;
}

export const TimePicker = React.forwardRef<HTMLDivElement, TimePickerProps>(
  (
    { value, onChange, className, use12Hour = false, showSeconds = false },
    ref
  ) => {
    const hourRef = React.useRef<HTMLInputElement>(null);
    const minuteRef = React.useRef<HTMLInputElement>(null);
    const secondRef = React.useRef<HTMLInputElement>(null);

    // Parse the initial value
    const parseValue = (val?: string) => {
      if (!val) return { h: "", m: "", s: "", p: "AM" };
      const [h, m, s] = val.split(":");
      let hour = parseInt(h, 10);
      let period = "AM";
      if (use12Hour) {
        if (hour >= 12) {
          period = "PM";
          if (hour > 12) hour -= 12;
        }
        if (hour === 0) hour = 12;
      }
      return {
        h: isNaN(hour) ? "" : hour.toString().padStart(2, '0'),
        m: m || "",
        s: s || "",
        p: period as "AM" | "PM",
      };
    };

    const [hour, setHour] = React.useState(parseValue(value).h);
    const [minute, setMinute] = React.useState(parseValue(value).m);
    const [second, setSecond] = React.useState(parseValue(value).s);
    const [period, setPeriod] = React.useState<"AM" | "PM">(parseValue(value).p as "AM" | "PM");

    // Effect to update internal state when the value prop changes
    React.useEffect(() => {
        const {h, m, s, p} = parseValue(value);
        setHour(h);
        setMinute(m);
        setSecond(s);
        setPeriod(p as "AM" | "PM");
    }, [value, use12Hour]);

    // Effect to call onChange when any time segment changes
    React.useEffect(() => {
      let h = parseInt(hour, 10);
      const m = parseInt(minute, 10);
      const s = parseInt(second, 10);

      if (isNaN(h) || isNaN(m) || (showSeconds && isNaN(s))) {
        return;
      }

      if (use12Hour) {
        if (period === "PM" && h < 12) {
          h += 12;
        } else if (period === "AM" && h === 12) {
          h = 0;
        }
      }

      const newTime = [
        h.toString().padStart(2, "0"),
        m.toString().padStart(2, "0"),
        ...(showSeconds ? [s.toString().padStart(2, "0")] : []),
      ].join(":");
      
      if (newTime !== value) {
        onChange(newTime);
      }
    }, [hour, minute, second, period, use12Hour, showSeconds, onChange, value]);
    
    const handleSegmentChange = (
      e: React.ChangeEvent<HTMLInputElement>,
      setter: React.Dispatch<React.SetStateAction<string>>,
      max: number,
      nextRef?: React.RefObject<HTMLInputElement | null>
    ) => {
      const val = e.target.value.replace(/[^0-9]/g, "");
      if (parseInt(val, 10) > max) return;
      
      setter(val);

      if (val.length === 2 && nextRef?.current) {
        nextRef.current.focus();
        nextRef.current.select();
      }
    };

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        prevRef?: React.RefObject<HTMLInputElement | null>
    ) => {
        if (e.key === "Backspace" && e.currentTarget.value === "" && prevRef?.current) {
            prevRef.current.focus();
            prevRef.current.select();
        }
    };

    const TimePickerInput = cn("w-12 text-center tabular-nums focus:bg-accent focus:text-accent-foreground focus-visible:ring-0 focus-visible:ring-offset-0 border-none");

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center w-fit border border-input rounded-md p-1",
          className
        )}
      >
        <Input
          ref={hourRef}
          className={TimePickerInput}
          placeholder={use12Hour ? "12" : "00"}
          value={hour}
          onChange={(e) => handleSegmentChange(e, setHour, use12Hour ? 12 : 23, minuteRef)}
          onKeyDown={handleKeyDown}
          maxLength={2}
        />
        <span className="text-muted-foreground">:</span>
        <Input
          ref={minuteRef}
          className={TimePickerInput}
          placeholder="00"
          value={minute}
          onChange={(e) => handleSegmentChange(e, setMinute, 59, showSeconds ? secondRef : undefined)}
          onKeyDown={(e) => handleKeyDown(e, hourRef)}
          maxLength={2}
        />
        {showSeconds && (
          <>
            <span className="text-muted-foreground">:</span>
            <Input
              ref={secondRef}
              className={TimePickerInput}
              placeholder="00"
              value={second}
              onChange={(e) => handleSegmentChange(e, setSecond, 59)}
              onKeyDown={(e) => handleKeyDown(e, minuteRef)}
              maxLength={2}
            />
          </>
        )}
        {use12Hour && (
          <Button
            variant="outline"
            size="sm"
            className="ml-2 h-8"
            onClick={() => setPeriod(period === "AM" ? "PM" : "AM")}
          >
            {period}
          </Button>
        )}
      </div>
    );
  }
);
TimePicker.displayName = "TimePicker";