//categories-table.tsx
"use client";

import * as React from "react";
import { DataTable } from "@/shared/components/data-table/data-table";
import { DataTableAdvancedToolbar } from "@/shared/components/data-table/data-table-advanced-toolbar";
import { DataTableFilterList } from "@/shared/components/data-table/data-table-filter-list";
import { DataTableFilterMenu } from "@/shared/components/data-table/data-table-filter-menu";
import { DataTableSortList } from "@/shared/components/data-table/data-table-sort-list";
import { DataTableToolbar } from "@/shared/components/data-table/data-table-toolbar";
import type { Category } from "../api";
import { useDataTable } from "@/shared/hooks/use-data-table";
import type { DataTableRowAction,QueryKeys } from "@/shared/types/data-table";
import type { getCategories, getCategoryApprovalCounts } from "../api";
import { DeleteCategoriesDialog } from "./delete-recipe-dialog";
import { useFeatureFlags } from "./feature-flags-provider";
import { CategoriesTableActionBar } from "./recipe-table-action-bar";
import { getCategoriesTableColumns } from "./recipe-table-columns";
import { UpdateCategorySheet } from "./update-recipe-dialog";

interface CategoriesTableProps {
  categoriesData: Awaited<ReturnType<typeof getCategories>>;
  approvalCounts: Awaited<ReturnType<typeof getCategoryApprovalCounts>>;
  queryKeys?: Partial<QueryKeys>;
}

export function CategoriesTable({
  categoriesData,
  approvalCounts,
  queryKeys,
}: CategoriesTableProps) {
  const { enableAdvancedFilter, filterFlag } = useFeatureFlags();

  const [rowAction, setRowAction] =
    React.useState<DataTableRowAction<Category> | null>(null);

  const columns = React.useMemo(
    () =>
      getCategoriesTableColumns({
        approvalCounts,
        setRowAction,
      }),
    [approvalCounts]
  );

  const { table, shallow, debounceMs, throttleMs } = useDataTable({
    data: categoriesData.results,
    columns,
    pageCount: categoriesData.total_pages,
    enableAdvancedFilter,
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
      columnPinning: { right: ["actions"] },
    },
    queryKeys,
    getRowId: (row) => row.id,
    shallow: false,
    clearOnDefault: true,
  });

  return (
    <>
      <DataTable
        table={table}
        actionBar={<CategoriesTableActionBar table={table} />}
      >
        
        {enableAdvancedFilter ? (
          <DataTableAdvancedToolbar table={table}>
            <DataTableSortList table={table} align="start" />
            {filterFlag === "advancedFilters" ? (
              <DataTableFilterList
                table={table}
                shallow={shallow}
                debounceMs={debounceMs}
                throttleMs={throttleMs}
                align="start"
              />
            ) : (
              <DataTableFilterMenu
                table={table}
                shallow={shallow}
                debounceMs={debounceMs}
                throttleMs={throttleMs}
              />
            )}
          </DataTableAdvancedToolbar>
        ) : (
          <DataTableToolbar table={table}>
            <DataTableSortList table={table} align="end" />
          </DataTableToolbar>
        )}


         <DataTableToolbar table={table}>
            <DataTableSortList table={table} align="end" />
          </DataTableToolbar>
      </DataTable>

      <UpdateCategorySheet
        open={rowAction?.variant === "update"}
        onOpenChange={() => setRowAction(null)}
        category={rowAction?.row.original ?? null}
      />

      <DeleteCategoriesDialog
        open={rowAction?.variant === "delete"}
        onOpenChange={() => setRowAction(null)}
        categories={
          rowAction?.row.original ? [rowAction.row.original] : []
        }
        showTrigger={false}
        onSuccess={() => rowAction?.row.toggleSelected(false)}
      />
    </>
  );
}
