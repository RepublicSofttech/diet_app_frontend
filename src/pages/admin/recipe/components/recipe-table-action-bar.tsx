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

import type { Recipe } from "../api";
import { CreateRecipeSheet } from "./create-recipe-dialog";

interface RecipesTableActionBarProps {
  table: Table<Recipe>;
}

export function RecipesTableActionBar({
  table,
}: RecipesTableActionBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <CreateRecipeSheet />

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              exportTableToCSV(table, {
                filename: "recipes",
                excludeColumns: ["select", "actions", "image"],
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
