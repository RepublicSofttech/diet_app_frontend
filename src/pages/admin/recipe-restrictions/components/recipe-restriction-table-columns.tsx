"use client";
import type { ColumnDef } from "@tanstack/react-table";
import {Check, Ellipsis,FileText, Image, Pencil, Trash2} from "lucide-react";
import * as React from "react";
import { DataTableColumnHeader } from "@/shared/components/data-table/data-table-column-header";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Checkbox } from "@/shared/components/ui/checkbox";
import type { DataTableRowAction } from "@/shared/types/data-table";
import type { IngredientUI } from "../api";
import { formatDate } from "@/shared/lib/format";

interface GetIngredientsTableColumnsProps {
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<IngredientUI> | null>
  >;
}

export function getIngredientsTableColumns({
  setRowAction,
}: GetIngredientsTableColumnsProps): ColumnDef<IngredientUI>[] {
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
      id: "image",
      accessorKey: "image_url",
      header: () => <span className="sr-only">Image</span>,
      cell: ({ cell }) => {
        const src = cell.getValue<string | null>();

        return (
          <div className="flex size-10 items-center justify-center overflow-hidden rounded-md bg-muted">
            {src ? (
              <img
                src={src}
                alt="Recipe"
                className="h-full w-full object-cover"
              />
            ) : (
              <Image className="size-4 text-muted-foreground" />
            )}
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
      size: 56,
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
      id: "calories",
      accessorKey: "calories",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Calories" />
      ),
      cell: ({ row }) => {
        const calories = row.getValue("calories") as string;
        return (
          <div className="max-w-125 truncate text-muted-foreground">
            {calories || "No calories"}
          </div>
        );
      },
       meta: {
              label: "Calories",
              placeholder: "Search calories...",
              variant: "text",
              icon: FileText,
            },
            enableColumnFilter: true,
    },
    {
      id: "protein",
      accessorKey: "protein",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Protein" />
      ),
      cell: ({ row }) => (
        <span className="capitalize">{row.getValue("protein")}</span>
      ),
      meta: {
        label: "Protein",
        placeholder: "Filter protein...",
        variant: "text",
      },
      enableColumnFilter: true,
    },
    {
      id: "carbs",
      accessorKey: "carbs",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Carbs" />
      ),
      cell: ({ row }) => <span>{row.getValue("carbs")}</span>,
      meta: {
        label: "Carbs",
        placeholder: "Filter carbs...",
        variant: "text",
      },
      enableColumnFilter: true,
    },

    {
      id: "fat",
      accessorKey: "fat",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Fat" />
      ),
      cell: ({ row }) => <span>{row.getValue("fat")}</span>,
      meta: {
        label: "Fat",
        placeholder: "Filter fat...",
        variant: "text",
      },
      enableColumnFilter: true,
    },

    {
      id: "is_vegan",
      accessorKey: "is_vegan",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Vegan" />
      ),
      cell: ({ row }) => (
        <span>{row.getValue("is_vegan") ? "Yes" : "No"}</span>
      ),
      meta: {
        label: "Vegan",
        variant: "boolean",
      },
      enableColumnFilter: true,
    },

    {
      id: "is_non_vegetarian",
      accessorKey: "is_non_vegetarian",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Non-Vegetarian" />
      ),
      cell: ({ row }) => (
        <span>{row.getValue("is_non_vegetarian") ? "Yes" : "No"}</span>
      ),
      meta: {
        label: "Non-Vegetarian",
        variant: "boolean",
      },
      enableColumnFilter: true,
    },

    {
      id: "is_approved",
      accessorKey: "is_approved",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Approved" />
      ),
      cell: ({ row }) => (
        <span>{row.getValue("is_approved") ? "Approved" : "Pending"}</span>
      ),
      meta: {
        label: "Approved",
        variant: "boolean",
      },
      enableColumnFilter: true,
    },

    {
      id: "created_at",
      accessorKey: "created_at",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Created At" />
      ),
       cell: ({ cell }) => formatDate(cell.getValue<Date>()),
      meta: {
        label: "Created At",
        variant: "date",
      },
      enableColumnFilter: true,
    },

    {
      id: "updated_at",
      accessorKey: "updated_at",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Updated At" />
      ),
       cell: ({ cell }) => formatDate(cell.getValue<Date>()),
      meta: {
        label: "Updated At",
        variant: "date",
      },
      enableColumnFilter: true,
    },

    {
      id: "created_by",
      accessorKey: "created_by",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Created By" />
      ),
      cell: ({ row }) => <span>{row.getValue("created_by")}</span>,
      meta: {
        label: "Created By",
        placeholder: "Filter creator...",
        variant: "text",
      },
      enableColumnFilter: true,
    },

    {
      id: "actions",
      accessorKey: "actions",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Actions" />
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
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
                        <DropdownMenuItem
              onSelect={() => setRowAction({ row, variant: "approve" })}
            >
              <Check className="mr-2 h-4 w-4" />
              Approve
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => setRowAction({ row, variant: "delete" })}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
        meta: {
        label: "Actions",
        placeholder: "Filter action...",
        variant: "text",
      },
      enableColumnFilter: true,
      size: 40,
    },
  ];
}