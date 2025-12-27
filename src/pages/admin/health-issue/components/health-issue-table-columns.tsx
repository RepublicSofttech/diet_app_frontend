//categories-table-columns.tsx

"use client";

import type { ColumnDef } from "@tanstack/react-table";
import {
  Ellipsis,
  FileText,
} from "lucide-react";
import * as React from "react";
import { DataTableColumnHeader } from "@/shared/components/data-table/data-table-column-header";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import type { HealthIssue } from "../api";
import { formatDate } from "@/shared/lib/format";
import type { DataTableRowAction } from "@/shared/types/data-table";


interface GetHealthIssueTableColumnsProps {
  approvalCounts: Record<string, number>;
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<HealthIssue> | null>
  >;
}

export function getHealthIssueTableColumns({
  setRowAction,
}: GetHealthIssueTableColumnsProps): ColumnDef<HealthIssue>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          aria-label="Select all"
          className="translate-y-0.5"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          aria-label="Select row"
          className="translate-y-0.5"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      ),
      enableHiding: false,
      enableSorting: false,
      size: 40,
    },
    {
      id: "name",
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Name" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="max-w-125 truncate font-medium">
            {row.getValue("name")}
          </span>
        </div>
      ),
      meta: {
        label: "Name",
        placeholder: "Search names...",
        variant: "text",
        icon: FileText,
      },
      enableColumnFilter: true,
    },
    {
      id: "description",
      accessorKey: "description",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Description" />
      ),
      cell: ({ row }) => {
        const description = row.getValue("description") as string;
        return (
          <div className="max-w-125 truncate text-muted-foreground">
            {description || "No description"}
          </div>
        );
      },
        meta: {
        label: "Description",
        placeholder: "Search Description...",
        variant: "text",
        icon: FileText,
      },
      enableColumnFilter: true,
    },
    {
      id: "createdAt",
      accessorKey: "created_at",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Created" />
      ),
      cell: ({ cell }) => formatDate(cell.getValue<Date>()),
    },
    {
      id: "createdBy",
      accessorKey: "created_by",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Created By" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="max-w-125 truncate font-medium">
            {row.getValue("createdBy")}
          </span>
        </div>
      ),
    },
    {
      id: "updatedAt",
      accessorKey: "updated_at",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Updated" />
      ),
      cell: ({ cell }) => formatDate(cell.getValue<Date>()),
    },
    {
      id: "actions",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Action" />
      ),
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              aria-label="Open menu"
              variant="ghost"
              className="flex size-8 p-0 data-[state=open]:bg-muted"
            >
              <Ellipsis className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              onSelect={() => setRowAction({ row, variant: "update" })}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => setRowAction({ row, variant: "delete" })}
              className="text-destructive focus:text-destructive"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      size: 40,
    },
  ];
}
