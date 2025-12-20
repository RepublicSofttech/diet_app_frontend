"use client";

import * as React from "react";
import { toast } from "sonner";
import { List, LayoutGrid } from "lucide-react";
import { DataTable } from "@/shared/components/data-table/data-table";
import { DataTableAdvancedToolbar } from "@/shared/components/data-table/data-table-advanced-toolbar";
import { DataTableFilterList } from "@/shared/components/data-table/data-table-filter-list";
import { DataTableFilterMenu } from "@/shared/components/data-table/data-table-filter-menu";
import { DataTableToolbar } from "@/shared/components/data-table/data-table-toolbar";
import { DataTablePagination } from "@/shared/components/data-table/data-table-pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import type { Category } from "../api";
import { useDataTableController } from "@/shared/hooks/use-data-table-controller";
import type { DataTableRowAction, QueryKeys } from "@/shared/types/data-table";
import { getCategories, getCategoryApprovalCounts, approveCategory } from "../api";
import { DeleteCategoriesDialog } from "./delete-categories-dialog";
import { useFeatureFlags } from "./feature-flags-provider";
import { CategoriesTableActionBar } from "./categories-table-action-bar";
import { getCategoriesTableColumns } from "./categories-table-columns";
import { UpdateCategorySheet } from "./update-category-sheet";
import { DataTableSortList } from "@/shared/components/data-table/data-table-sort-list";

interface CategoriesTableProps {
  queryKeys?: Partial<QueryKeys>;
}

export function CategoriesTable({ queryKeys }: CategoriesTableProps) {
  const { enableAdvancedFilter, filterFlag } = useFeatureFlags();

  const [rowAction, setRowAction] = React.useState<DataTableRowAction<Category> | null>(null);
  const [approvalCounts, setApprovalCounts] = React.useState<Record<string, number>>({ approved: 0, pending: 0 });
  const [viewMode, setViewMode] = React.useState<"table" | "card">("table");

  React.useEffect(() => {
    const fetchCounts = async () => {
      try {
        const counts = await getCategoryApprovalCounts();
        setApprovalCounts(counts);
      } catch (error) {
        console.error("Failed to fetch approval counts:", error);
      }
    };
    fetchCounts();
  }, []);

  const fetchData = React.useCallback(async (params: {
    page: number;
    perPage: number;
    sorting: any;
    filters: any;
  }) => {
    const result = await getCategories({
      page: params.page,
      perPage: params.perPage,
      filters: params.filters, // Add filters
    });
    return { data: result.results, totalCount: result.count };
  }, []);

  const columns = React.useMemo(
    () =>
      getCategoriesTableColumns({
        approvalCounts,
        setRowAction,
      }),
    [approvalCounts]
  );

  const { table, data, isLoading, setFilters, refetch } = useDataTableController({
    data: [], // Not needed since we fetch
    columns,
    pageCount: 1, // Will be updated
    enableAdvancedFilter,
    fetchData,
    queryKeys,
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
      columnPinning: { right: ["actions"] },
    },
  });

  React.useEffect(() => {
    if (rowAction?.variant === "approve") {
      const handleApprove = async () => {
        try {
          await approveCategory(rowAction.row.original.id, {
            is_approved: true,
          });
          toast.success("Category approved");
          refetch();
        } catch (error) {
          toast.error("Failed to approve category");
        }
      };
      handleApprove();
      setRowAction(null);
    }
  }, [rowAction, refetch]);

  const renderCardView = (data: Category[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((category) => (
        <Card key={category.id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {category.name}
              <Badge variant={category.isApproved ? "default" : "secondary"}>
                {category.isApproved ? "Approved" : "Pending"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">
              {category.description || "No description"}
            </p>
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>Created: {new Date(category.createdAt).toLocaleDateString()}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRowAction({ row: { original: category } as any, variant: "update" })}
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
                  shallow={false}
                  debounceMs={300}
                  throttleMs={50}
                  align="start"
                />
              ) : (
                <DataTableFilterMenu
                  table={table}
                  shallow={false}
                  debounceMs={300}
                  throttleMs={50}
                />
              )}
            </DataTableAdvancedToolbar>
          ) : (
            <DataTableToolbar table={table}>
              <DataTableSortList table={table} align="end" />
            </DataTableToolbar>
          )}
        </DataTable>
      ) : (
        <div>
          {enableAdvancedFilter ? (
            <DataTableAdvancedToolbar table={table}>
              <DataTableSortList table={table} align="start" />
              {filterFlag === "advancedFilters" ? (
                <DataTableFilterList
                  table={table}
                  shallow={false}
                  debounceMs={300}
                  throttleMs={50}
                  align="start"
                />
              ) : (
                <DataTableFilterMenu
                  table={table}
                  shallow={false}
                  debounceMs={300}
                  throttleMs={50}
                />
              )}
            </DataTableAdvancedToolbar>
          ) : (
            <DataTableToolbar table={table}>
              <DataTableSortList table={table} align="end" />
            </DataTableToolbar>
          )}
          {renderCardView(data)}
          <DataTablePagination table={table} />
        </div>
      )}

      <UpdateCategorySheet
        open={rowAction?.variant === "update"}
        onOpenChange={() => setRowAction(null)}
        category={rowAction?.row.original ?? null}
        onSuccess={refetch}
      />

      <DeleteCategoriesDialog
        open={rowAction?.variant === "delete"}
        onOpenChange={() => setRowAction(null)}
        categories={rowAction?.row.original ? [rowAction.row.original] : []}
        showTrigger={false}
        onSuccess={() => {
          rowAction?.row.toggleSelected(false);
          refetch();
        }}
      />
    </>
  );
}