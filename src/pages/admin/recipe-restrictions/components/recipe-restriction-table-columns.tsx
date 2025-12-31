"use client";

import type { ColumnDef } from "@tanstack/react-table";
import {
  Ellipsis,
  Pencil,
  Trash2,
  ShieldAlert,
} from "lucide-react";
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
import { Badge } from "@/shared/components/ui/badge";
import { Checkbox } from "@/shared/components/ui/checkbox";
import type { DataTableRowAction } from "@/shared/types/data-table";
import type { HealthRecipeMappingUI } from "../api";

interface Props {
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<HealthRecipeMappingUI> | null>
  >;
}

export function getHealthMappingTableColumns({
  setRowAction,
}: Props): ColumnDef<HealthRecipeMappingUI>[] {
  return [
    // Bulk Select
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          aria-label="Select all"
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
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 40,
    },

    // Recipe
    {
      id: "recipe",
      accessorFn: (row) => (row.recipe?.name ? row.recipe.name : row.recipe),
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Recipe" />
      ),
      cell: ({ row }) => (
        <span className="font-medium truncate">
          {row.original.recipe?.name ?? row.original.recipe ?? "—"}
        </span>
      ),
      meta: {
        label: "Recipe",
        placeholder: "Search recipe...",
        variant: "text",
      },
      enableColumnFilter: true,
    },

    // Health Condition
    {
      id: "condition",
      accessorFn: (row) => (row.condition?.name ? row.condition.name : row.condition),
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Health Condition" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          <span>{row.original.condition?.name ?? row.original.condition ?? "—"}</span>
        </div>
      ),
      meta: {
        label: "Condition",
        placeholder: "Search condition...",
        variant: "text",
      },
      enableColumnFilter: true,
    },

    // Restriction Type
    {
      id: "restriction_type",
      accessorKey: "restriction_type",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Restriction" />
      ),
      cell: ({ row }) => {
        const type = row.getValue<"avoid" | "recommended">("restriction_type");
        return (
          <Badge
            variant={type === "avoid" ? "destructive" : "default"}
            className="capitalize"
          >
            {type === "avoid" ? "Avoid" : "Recommended"}
          </Badge>
        );
      },
      meta: {
        label: "Restriction",
        variant: "select",
        options: [
          { label: "Avoid", value: "avoid" },
          { label: "Recommended", value: "recommended" },
        ],
      },
      enableColumnFilter: true,
    },

   

    // Actions
    {
      id: "actions",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Actions" />
      ),
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="data-[state=open]:bg-muted">
              <Ellipsis className="size-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onSelect={() => setRowAction({ row, variant: "update" })}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
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
      size: 40,
    },
  ];
}
