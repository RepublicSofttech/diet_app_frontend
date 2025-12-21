"use client";

import type { Table } from "@tanstack/react-table";
import { Download, Plus, Upload } from "lucide-react";
import { toast } from "sonner";
import { exportTableToCSV } from "@/shared/lib/export";
import { Button } from "@/shared/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { CreateHealthIssueDialog } from "./create-health-issue-dialog";
import type { HealthIssue } from "../api";

interface CategoriesTableActionBarProps {
  table: Table<HealthIssue>;
}

export function HealthIssueTableActionBar({
  table,
}: CategoriesTableActionBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <CreateHealthIssueDialog />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              exportTableToCSV(table, {
                filename: "health-issues",
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