//ingredients-table-columns.tsx

"use client";

import type { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  CheckCircle,
  Ellipsis,
  FileText,
  XCircle,
} from "lucide-react";
import * as React from "react";
import { DataTableColumnHeader } from "@/shared/components/data-table/data-table-column-header";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Checkbox } from "@/shared/components/ui/checkbox";
import type { DataTableRowAction } from "@/shared/types/data-table";
import type { Ingredient } from "../api";
import { formatDate } from "@/shared/lib/format";

interface GetIngredientsTableColumnsProps {
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<Ingredient> | null>
  >;
}

export function getIngredientsTableColumns({
  setRowAction,
}: GetIngredientsTableColumnsProps): ColumnDef<Ingredient>[] {
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
    },
    {
      id: "category",
      accessorKey: "category",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Category" />
      ),
      cell: ({ row }) => (
        <span className="capitalize">{row.getValue("category")}</span>
      ),
      meta: {
        label: "Category",
        placeholder: "Filter categories...",
        variant: "text",
      },
      enableColumnFilter: true,
    },
    {
      id: "unit",
      accessorKey: "unit",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Unit" />
      ),
      cell: ({ row }) => <span>{row.getValue("unit")}</span>,
      meta: {
        label: "Unit",
        placeholder: "Filter units...",
        variant: "text",
      },
      enableColumnFilter: true,
    },
    {
      id: "price",
      accessorKey: "price",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Price" />
      ),
      cell: ({ row }) => (
        <span>${(row.getValue("price") as number).toFixed(2)}</span>
      ),
      meta: {
        label: "Price",
        placeholder: "Filter by price...",
        variant: "number",
        unit: "$",
      },
      enableColumnFilter: true,
    },
    {
      id: "isActive",
      accessorKey: "isActive",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Status" />
      ),
      cell: ({ cell }) => {
        const isActive = cell.getValue<Ingredient["isActive"]>();

        return (
          <Badge
            variant={isActive ? "default" : "secondary"}
            className="py-1"
          >
            {isActive ? (
              <>
                <CheckCircle className="mr-1 size-3" />
                Active
              </>
            ) : (
              <>
                <XCircle className="mr-1 size-3" />
                Inactive
              </>
            )}
          </Badge>
        );
      },
      meta: {
        label: "Status",
        options: [
          { label: "Active", value: "true" },
          { label: "Inactive", value: "false" },
        ],
        variant: "select",
      },
      enableColumnFilter: true,
      filterFn: (row, id, value) => {
        return value === "true" ? row.getValue(id) === true : row.getValue(id) === false;
      },
    },
    {
      id: "createdAt",
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Created" />
      ),
      cell: ({ cell }) => formatDate(cell.getValue<Date>()),
    },
    {
      id: "actions",
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