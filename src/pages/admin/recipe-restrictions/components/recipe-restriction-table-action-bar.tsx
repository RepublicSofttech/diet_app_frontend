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
import type { IngredientUI } from "../api";
import { CreateIngredientSheet } from "./create-recipe-restriction-dialog";

interface IngredientsTableActionBarProps {
  table: Table<IngredientUI>;
  onSuccess?: () => void;
}

export function IngredientsTableActionBar({
  table,
  onSuccess,
}: IngredientsTableActionBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <CreateIngredientSheet onSuccess={onSuccess} />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              exportTableToCSV(table, {
                filename: "ingredients",
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