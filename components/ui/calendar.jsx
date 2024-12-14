"use client";
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

function Calendar({ className, classNames, showOutsideDays = true, ...props }) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-6 bg-white rounded-lg shadow-md", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-6 sm:space-x-6 sm:space-y-0",
        month: "space-y-6",
        caption: "flex justify-center pt-2 relative items-center",
        caption_label: "text-xl font-semibold text-gray-700",
        nav: "space-x-3 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-9 w-9 bg-transparent p-1 rounded-md opacity-70 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-2",
        nav_button_next: "absolute right-2",
        table: "w-full border-collapse space-y-2",
        head_row: "flex",
        head_cell: "text-gray-600 rounded-lg w-16 font-medium text-[1.1rem]",
        row: "flex w-full mt-3",
        cell: "h-16 w-16 text-center text-lg p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-lg [&:has([aria-selected].day-outside)]:bg-accent/60 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-lg last:[&:has([aria-selected])]:rounded-r-lg focus-within:relative focus-within:z-20",

        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-14 w-14 p-0 font-medium aria-selected:opacity-100 text-lg"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary-dark hover:text-primary-foreground focus:bg-primary-dark focus:text-primary-foreground",
        day_today: "bg-yellow-200 text-black font-bold",

        day_outside:
          "day-outside text-gray-400 aria-selected:bg-accent/60 aria-selected:text-muted-foreground",
        day_disabled: "text-gray-300 opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-5 w-5" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-5 w-5" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
