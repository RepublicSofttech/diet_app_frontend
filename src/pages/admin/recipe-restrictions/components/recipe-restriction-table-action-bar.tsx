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
import type { HealthRecipeMappingUI } from "../api";
import { CreateHealthMappingSheet } from "./create-recipe-restriction-dialog";

interface HealthMappingTableActionBarProps {
  table: Table<HealthRecipeMappingUI>;
  onSuccess?: () => void;
}

export function HealthMappingTableActionBar({
  table,
  onSuccess,
}: HealthMappingTableActionBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Create New Health Mapping */}
      <CreateHealthMappingSheet onSuccess={onSuccess} />

      {/* Export CSV */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              exportTableToCSV(table, {
                filename: "health_mappings",
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

      {/* Clear Selected Rows */}
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
