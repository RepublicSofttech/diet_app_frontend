"use client";

import * as React from "react";
import { toast } from "sonner";
import { List, LayoutGrid, Table } from "lucide-react";

import { DataTable } from "@/shared/components/data-table/data-table";
import { DataTableAdvancedToolbar } from "@/shared/components/data-table/data-table-advanced-toolbar";
import { DataTableFilterList } from "@/shared/components/data-table/data-table-filter-list";
import { DataTableToolbar } from "@/shared/components/data-table/data-table-toolbar";
import { DataTablePagination } from "@/shared/components/data-table/data-table-pagination";
import { DataTableSortList } from "@/shared/components/data-table/data-table-sort-list";

import { Button } from "@/shared/components/ui/button";

import type { IngredientUI } from "../api";
import { ingredientsApi } from "@/shared/api/ingredients.api";
import { useDataTableController } from "@/shared/hooks/use-data-table-controller";
import type { DataTableRowAction, QueryKeys } from "@/shared/types/data-table";

import { getIngredientsTableColumns } from "./ingredients-table-columns";
import { UpdateIngredientSheet } from "./update-ingredient-dialog";
import { DeleteIngredientsDialog } from "./delete-ingredients-dialog";
import { CreateIngredientSheet } from "./create-ingredients-dialog";
import { renderIngredientListView } from "./renderListView";
import { renderIngredientCardView } from "./renderCardView";
import { IngredientsTableActionBar } from "./ingredients-table-action-bar";

interface IngredientsTableProps {
  queryKeys?: Partial<QueryKeys>;
}

export function IngredientsTable({ queryKeys }: IngredientsTableProps) {
  const [rowAction, setRowAction] = React.useState<DataTableRowAction<IngredientUI> | null>(null);
  const [viewMode, setViewMode] = React.useState<"list" | "table" | "card">("list");

  const fetchData = React.useCallback(async (params: any) => {
    const result = await ingredientsApi.get({
      page: params.page,
      perPage: params.perPage,
      filters: params.filters,
      sorting: params.sorting,
    });
    return { data: result.data, totalCount: result.count };
  }, []);

  // Handle Approval Action
  React.useEffect(() => {
    if (rowAction?.variant === "approve") {
      const handleApprove = async () => {
        try {
          // Assuming API has an approve method similar to recipes
          await ingredientsApi.approve(rowAction.row.original.id, { is_approved: true });
          toast.success("Ingredient approved");
          refetch();
        } catch (error) {
          toast.error("Failed to approve ingredient");
        }
      };
      handleApprove();
      setRowAction(null);
    }
  }, [rowAction]);

  const columns = React.useMemo(() => getIngredientsTableColumns({ setRowAction }), []);

  const { table, data, refetch } = useDataTableController({
    data: [],
    columns,
    fetchData,
    pageCount: 1,
    queryKeys,
    enableAdvancedFilter: true,
    initialState: {
      sorting: [{ id: "created_at", desc: true }],
      columnPinning: { right: ["actions"] },
    },
  });

  return (
    <>
      {/* View Switcher Bar */}
      <div className="mb-4 flex justify-end gap-2">
        <CreateIngredientSheet onSuccess={refetch} />

        <Button
          size="sm"
          variant={viewMode === "list" ? "default" : "outline"}
          onClick={() => setViewMode("list")}
        >
          <List className="h-4 w-4" />
        </Button>

        <Button
          size="sm"
          variant={viewMode === "table" ? "default" : "outline"}
          onClick={() => setViewMode("table")}
        >
          <Table className="h-4 w-4" />
        </Button>

        <Button
          size="sm"
          variant={viewMode === "card" ? "default" : "outline"}
          onClick={() => setViewMode("card")}
        >
          <LayoutGrid className="h-4 w-4" />
        </Button>
      </div>

      {/* Shared Toolbar */}
      <DataTableAdvancedToolbar table={table}>
        <DataTableSortList table={table} align="start" />
        <DataTableFilterList table={table} align="start" />
      </DataTableAdvancedToolbar>

      {/* Views Rendering */}
      {viewMode === "table" && (
        <DataTable
          table={table}
          actionBar={<IngredientsTableActionBar table={table} onSuccess={refetch} />}
        />
      )}

      {viewMode === "list" && (
        <div className="space-y-4">
          {renderIngredientListView(data, setRowAction)}
          <DataTablePagination table={table} />
        </div>
      )}

      {viewMode === "card" && (
        <div className="space-y-4">
          {renderIngredientCardView(data, setRowAction)}
          <DataTablePagination table={table} />
        </div>
      )}

      {/* Actions Dialogs */}
      <UpdateIngredientSheet
        open={rowAction?.variant === "update"}
        onOpenChange={() => setRowAction(null)}
        ingredient={rowAction?.row.original ?? null}
        onSuccess={refetch}
      />

      <DeleteIngredientsDialog
        open={rowAction?.variant === "delete"}
        onOpenChange={() => setRowAction(null)}
        ingredients={rowAction?.row.original ? [rowAction.row.original] : []}
        showTrigger={false}
        onSuccess={refetch}
      />
    </>
  );
}