//categories-table-columns.tsx

"use client";

import type { ColumnDef } from "@tanstack/react-table";
import {
  CheckCircle,
  Ellipsis,
  FileText,
  XCircle,
} from "lucide-react";
import * as React from "react";
import { DataTableColumnHeader } from "@/shared/components/data-table/data-table-column-header";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import type { Category } from "../api";
import { formatDate } from "@/shared/lib/format";
import type { DataTableRowAction } from "@/shared/types/data-table";


interface GetCategoriesTableColumnsProps {
  approvalCounts: Record<string, number>;
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<Category> | null>
  >;
}

export function getCategoriesTableColumns({
  approvalCounts,
  setRowAction,
}: GetCategoriesTableColumnsProps): ColumnDef<Category>[] {
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
      id: "isApproved",
      accessorKey: "is_approved",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Status" />
      ),
      cell: ({ cell }) => {
        const isApproved = cell.getValue<Category["is_approved"]>();

        return (
          <Badge
            variant={isApproved ? "default" : "secondary"}
            className="py-1"
          >
            {isApproved ? (
              <>
                <CheckCircle className="mr-1 size-3" />
                Approved
              </>
            ) : (
              <>
                <XCircle className="mr-1 size-3" />
                Pending
              </>
            )}
          </Badge>
        );
      },
      meta: {
        label: "Approval Status",
        variant: "multiSelect",
        options: [
          {
            label: "Approved",
            value: "approved",
            count: approvalCounts.approved,
            icon: CheckCircle,
          },
          {
            label: "Pending",
            value: "pending",
            count: approvalCounts.pending,
            icon: XCircle,
          },
        ],
        icon: CheckCircle,
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
            {!row.original.is_approved && (
              <DropdownMenuItem
                onSelect={() => setRowAction({ row, variant: "approve" })}
              >
                Approve
              </DropdownMenuItem>
            )}
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
