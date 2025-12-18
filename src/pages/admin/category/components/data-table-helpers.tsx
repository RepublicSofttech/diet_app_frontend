"use client";
import { type Column } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib";

/**
 * A reusable component to create a sortable header for a data table column.
 */
export const DataTableColumnHeader = <TData, TValue>({
  column,
  label,
  className,
}: {
  column: Column<TData, TValue>;
  label: string;
  className?: string;
}) => {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>{label}</span>
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};