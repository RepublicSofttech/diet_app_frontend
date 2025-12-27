"use client";

import type { ColumnDef } from "@tanstack/react-table";
import {
  Check,
  CheckCircle,
  Ellipsis,
  Eye,
  FileText,
  Image as ImageIcon,
  Pencil,
  Trash2,
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

import type { Recipe } from "../api";
import { formatDate } from "@/shared/lib/format";
import type { DataTableRowAction } from "@/shared/types/data-table";

interface GetRecipesTableColumnsProps {
  approvalCounts: Record<string, number>;
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<Recipe> | null>
  >;
  onViewDetails:any
}

export function getRecipesTableColumns({
  approvalCounts,
  setRowAction,
  onViewDetails
}: GetRecipesTableColumnsProps): ColumnDef<Recipe>[] {
  return [
    /* Image */
   

    /* Select */
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
          onCheckedChange={(value) =>
            table.toggleAllPageRowsSelected(!!value)
          }
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
      enableSorting: false,
      enableHiding: false,
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
              <ImageIcon className="size-4 text-muted-foreground" />
            )}
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
      size: 56,
    },

    /* Name */
    {
      id: "name",
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Name" />
      ),
      cell: ({ row }) => (
        <span className="max-w-125 truncate font-medium">
          {row.getValue("name")}
        </span>
      ),
      meta: {
        label: "Name",
        placeholder: "Search recipes...",
        variant: "text",
        icon: FileText,
      },
      enableColumnFilter: true,
    },

    /* Description */
    {
      id: "description",
      accessorKey: "description",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Description" />
      ),
      cell: ({ row }) => {
        const description = row.getValue("description") as string | null;
        return (
          <div className="max-w-125 truncate text-muted-foreground">
            {description || "No description"}
          </div>
        );
      },
      meta: {
        label: "Description",
        placeholder: "Search description...",
        variant: "text",
        icon: FileText,
      },
      enableColumnFilter: true,
    },

    /* Diet Type */
    {
      id: "dietType",
      accessorKey: "diet_type",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Diet" />
      ),
      cell: ({ cell }) => (
        <Badge variant="outline">{cell.getValue<string>()}</Badge>
      ),
      meta: {
        label: "Diet Type",
        placeholder: "Filter diet...",
        variant: "text",
      },
      enableColumnFilter: true,
    },

    /* Status */
    {
      id: "isApproved",
      accessorKey: "is_approved",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Status" />
      ),
      cell: ({ cell }) => {
        const isApproved = cell.getValue<boolean>();

        return (
          <Badge variant={isApproved ? "default" : "secondary"} className="py-1">
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

    /* Created */
    {
      id: "createdAt",
      accessorKey: "created_at",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Created" />
      ),
      cell: ({ cell }) => formatDate(cell.getValue<Date>()),
    },

    /* Updated */
    {
      id: "updatedAt",
      accessorKey: "updated_at",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Updated" />
      ),
      cell: ({ cell }) => formatDate(cell.getValue<Date>()),
    },

    /* Actions */
    {
      id: "actions",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Action" />
      ),
      cell: ({ row }) => {

        return<DropdownMenu>
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
               onSelect={() =>{onViewDetails(row.original.id)}}
            >
              <Eye className="mr-2 h-4 w-4" />
              View details
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => setRowAction({ row, variant: "update" })}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            {!row.original.is_approved && (
              <DropdownMenuItem
                onSelect={() => setRowAction({ row, variant: "approve" })}
              >
                <Check className="mr-2 h-4 w-4" />
                Approve
              </DropdownMenuItem>
            )}
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
      },
      size: 40,
    },
  ];
}
