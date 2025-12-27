"use client";

import * as React from "react";
import { toast } from "sonner";
import { List, LayoutGrid, Table } from "lucide-react";

import { DataTable } from "@/shared/components/data-table/data-table";
import { DataTableAdvancedToolbar } from "@/shared/components/data-table/data-table-advanced-toolbar";
import { DataTableFilterList } from "@/shared/components/data-table/data-table-filter-list";
import { DataTableFilterMenu } from "@/shared/components/data-table/data-table-filter-menu";
import { DataTableToolbar } from "@/shared/components/data-table/data-table-toolbar";
import { DataTablePagination } from "@/shared/components/data-table/data-table-pagination";
import { DataTableSortList } from "@/shared/components/data-table/data-table-sort-list";

import { Button } from "@/shared/components/ui/button";

import type { Recipe } from "../api";
import { recipesApi } from "@/shared/api/recipe.api";
import { useDataTableController } from "@/shared/hooks/use-data-table-controller";
import type { DataTableRowAction, QueryKeys } from "@/shared/types/data-table";

import { getRecipesTableColumns } from "./recipe-table-columns";
import { RecipesTableActionBar } from "./recipe-table-action-bar";
import { UpdateRecipeSheet } from "./update-recipe-dialog";
import { DeleteRecipesDialog } from "./delete-recipe-dialog";
import { CreateRecipeSheet } from "./create-recipe-dialog";
import { useFeatureFlags } from "./feature-flags-provider";
import { renderListView } from "./renderListView";
import { renderCardView } from "./renderCardView";
import { useNavigate } from "react-router-dom";

interface RecipesTableProps {
  queryKeys?: Partial<QueryKeys>;
}

export function RecipesTable({ queryKeys }: RecipesTableProps) {
  const { enableAdvancedFilter, filterFlag } = useFeatureFlags();

  const [rowAction, setRowAction] =
    React.useState<DataTableRowAction<Recipe> | null>(null);

  const [approvalCounts, _setApprovalCounts] = React.useState({
    approved: 0,
    pending: 0,
  });

  // 🔑 Default = LIST view
  const [viewMode, setViewMode] =
    React.useState<"list" | "table" | "card">("list");

  const navigate = useNavigate();

  const onViewDetails = (id:any)=>{
   navigate(`/admin/meals&recipes/meals/${id}`)
  }





  const fetchData = React.useCallback(async (params: any) => {
    const result = await recipesApi.get({
      page: params.page,
      perPage: params.perPage,
      filters: params.filters,
      sort: params.sorting,
    });

    return { data: result.data, totalCount: result.count };
  }, []);


    React.useEffect(() => {
        if (rowAction?.variant === "approve") {
          const handleApprove = async () => {
            try {
              await recipesApi.approve(rowAction.row.original.id, {
                is_approved: true,
              });
              toast.success("Recipe approved");
              refetch();
            } catch (error) {
              toast.error("Failed to approve category");
            }
          };
          handleApprove();
          setRowAction(null);
        }
      }, [rowAction, fetchData]);

  const columns = React.useMemo(
    () =>
      getRecipesTableColumns({
        approvalCounts,
        setRowAction,
        onViewDetails
      }),
    [approvalCounts],
  );

  const { table, data, refetch } = useDataTableController({
    data: [],
    columns,
    pageCount: 1,
    enableAdvancedFilter,
    fetchData,
    queryKeys,
    initialState: {
      sorting: [{ id: "created_at", desc: true }],
      columnPinning: { right: ["actions"] },
    },
  });

  /* ---------------- LIST VIEW ---------------- */



  /* ---------------- UI ---------------- */

  return (
    <>
      {/* View Switch */}
      <div className="mb-4 flex justify-end gap-2">
        <CreateRecipeSheet onSuccess={refetch} />

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
      {enableAdvancedFilter ? (
        <DataTableAdvancedToolbar table={table}>
          <DataTableSortList table={table} align="start" />
          {filterFlag === "advancedFilters" ? (
            <DataTableFilterList table={table} />
          ) : (
            <DataTableFilterMenu table={table} />
          )}
        </DataTableAdvancedToolbar>
      ) : (
        <DataTableToolbar table={table}>
          <DataTableSortList table={table} align="end" />
        </DataTableToolbar>
      )}

      {/* Views */}
      {viewMode === "table" && (
        <DataTable
          table={table}
          actionBar={<RecipesTableActionBar table={table} />}
        />
      )}

      {viewMode === "list" && (
        <>
          {renderListView(data,setRowAction , onViewDetails)}
          <DataTablePagination table={table} />
        </>
      )}
      {viewMode === "card" && (
        <>
          {renderCardView(data,setRowAction , onViewDetails)}
          <DataTablePagination table={table} />
        </>
      )}

      {/* Dialogs */}
      <UpdateRecipeSheet
        open={rowAction?.variant === "update"}
        onOpenChange={() => setRowAction(null)}
        recipe={rowAction?.row.original ?? null}
        onSuccess={refetch}
      />

      <DeleteRecipesDialog
        open={rowAction?.variant === "delete"}
        onOpenChange={() => setRowAction(null)}
        recipes={
          rowAction?.row.original ? [rowAction.row.original] : []
        }
        showTrigger={false}
        onSuccess={refetch}
      />
    </>
  );
}
