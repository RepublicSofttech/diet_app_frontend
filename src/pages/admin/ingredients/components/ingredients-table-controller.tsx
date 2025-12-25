"use client";

import * as React from "react";
import { List, LayoutGrid } from "lucide-react";
import { DataTable } from "@/shared/components/data-table/data-table";
import { DataTableAdvancedToolbar } from "@/shared/components/data-table/data-table-advanced-toolbar";
import { DataTableFilterList } from "@/shared/components/data-table/data-table-filter-list";
import { DataTableSortList } from "@/shared/components/data-table/data-table-sort-list";
import { DataTablePagination } from "@/shared/components/data-table/data-table-pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import type { IngredientUI } from "../api";
import type { DataTableRowAction, QueryKeys } from "@/shared/types/data-table";
import { getIngredientsTableColumns } from "./ingredients-table-columns";
import { UpdateIngredientSheet } from "./update-ingredient-dialog";
import { DeleteIngredientsDialog } from "./delete-ingredients-dialog";
import { IngredientsTableActionBar } from "./ingredients-table-action-bar";
import { ingredientsApi } from "@/shared/api/ingredients.api";
import { useDataTableController } from "@/shared/hooks/use-data-table-controller";
import { CreateIngredientSheet } from "./create-ingredients-dialog";
interface IngredientsTableProps {
  queryKeys?: Partial<QueryKeys>;
}

export function IngredientsTable({ queryKeys }: IngredientsTableProps) {
  const [rowAction, setRowAction] = React.useState<DataTableRowAction<IngredientUI> | null>(null);
  const [viewMode, setViewMode] = React.useState<"table" | "card">("table");

  const fetchData = React.useCallback(async (params: {
    page: number;
    perPage: number;
    sorting: any;
    filters: any;
  }) => {
    const result = await ingredientsApi.get({
      page: params.page,
      perPage: params.perPage,
      filters: params.filters,
      sorting: params.sorting,
    });
    return { data: result.data, totalCount: result.count };
  }, []);

  const columns = React.useMemo(
    () =>
      getIngredientsTableColumns({
        setRowAction,
      }),
    []
  );

  const {table,data,refetch} = useDataTableController({
    data: [],
    columns,
    fetchData,
    pageCount: 1, // Will be updated
    queryKeys,
    enableAdvancedFilter: true,
    initialState: {
      sorting: [{ id: "created_at", desc: true }],
      columnPinning: { right: ["actions"] },
    },
  });

  const renderCardView = (data: IngredientUI[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((ingredient) => (
        <Card key={ingredient.id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {ingredient?.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">
              {ingredient?.calories || "No description"}
            </p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>Calories: {ingredient?.calories}</p>
              <p>Protein: {ingredient?.protein}</p>
              <p>Carbs:{ingredient?.carbs}</p>
              <p>Fat:{ingredient?.fat}</p>
              <p>Created: {new Date(ingredient.created_at).toLocaleDateString()}</p>
            </div>
            <div className="flex justify-end mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRowAction({ row: { original: ingredient } as any, variant: "update" })}
              >
                Edit
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <>
      <div className="flex justify-end mb-4">
        <div className="flex items-center gap-2">
          <CreateIngredientSheet/>
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("table")}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "card" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("card")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {viewMode === "table" ? (
        <DataTable table={table} actionBar={<IngredientsTableActionBar table={table} onSuccess={refetch} />}>
          <DataTableAdvancedToolbar table={table}>
            <DataTableSortList table={table} align="start" />
            <DataTableFilterList
              table={table}
              shallow={false}
              debounceMs={300}
              throttleMs={50}
              align="start"
            />
          </DataTableAdvancedToolbar>
        </DataTable>
      ) : (
        <div>
          <DataTableAdvancedToolbar table={table}>
            <DataTableSortList table={table} align="start" />
            <DataTableFilterList
              table={table}
              shallow={false}
              debounceMs={300}
              throttleMs={50}
              align="start"
            />
          </DataTableAdvancedToolbar>
          {renderCardView(data)}
          <DataTablePagination table={table} />
        </div>
      )}

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
        onSuccess={() => {
          rowAction?.row.toggleSelected(false);
          refetch();
        }}
      />
    </>
  );
}