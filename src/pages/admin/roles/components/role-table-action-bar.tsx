"use client";

import type { Table } from "@tanstack/react-table";
import { Download } from "lucide-react";
import { exportTableToCSV } from "@/shared/lib/export";
import { Button } from "@/shared/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { CreateRoleDialog } from "./create-role-dialog";
import type { Role } from "../api";

interface RoleTableActionBarProps {
  table: Table<Role>;
}

export function RoleTableActionBar({
  table,
}: RoleTableActionBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <CreateRoleDialog />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              exportTableToCSV(table, {
                filename: "Role",
                excludeColumns: ["select", "actions"],
              })
            }
          >
            <Download className="mr-2 size-4" />
            Export
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Export to CSV</p>
        </TooltipContent>
      </Tooltip>
      {table.getFilteredSelectedRowModel().rows.length > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            table.toggleAllPageRowsSelected(false);
          }}
        >
          Clear ({table.getFilteredSelectedRowModel().rows.length})
        </Button>
      )}
    </div>
  );
}