"use client";

import * as React from "react";
import { List, LayoutGrid } from "lucide-react";
import { DataTable } from "@/shared/components/data-table/data-table";
import { DataTableAdvancedToolbar } from "@/shared/components/data-table/data-table-advanced-toolbar";
import { DataTableFilterList } from "@/shared/components/data-table/data-table-filter-list";
import { DataTableFilterMenu } from "@/shared/components/data-table/data-table-filter-menu";
import { DataTableToolbar } from "@/shared/components/data-table/data-table-toolbar";
import { DataTablePagination } from "@/shared/components/data-table/data-table-pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import type {  Role } from "../api";
import { useDataTableController } from "@/shared/hooks/use-data-table-controller";
import type { DataTableRowAction, QueryKeys } from "@/shared/types/data-table";
import {  DeleteRoleDialog } from "./delete-role-dialog";
import { useFeatureFlags } from "./feature-flags-provider";
import { geRoleTableColumns } from "./role-table-columns";
import { UpdateRole } from "./update-role-dialog";
import { DataTableSortList } from "@/shared/components/data-table/data-table-sort-list";
import {  CreateRoleDialog } from "./create-role-dialog";
// import { roleApi } from "@/shared/api/role.api";
import { getCategoryApprovalCounts } from "../../categories/api";
import { RoleTableActionBar } from "./role-table-action-bar";
import { http } from "@/shared/api/httpAPI";
import { FullPageLoader } from "@/shared/components/spinner/FullPageLoader";

interface RoleTableProps {
  queryKeys?: Partial<QueryKeys>;
}

export function RoleTable({ queryKeys }: RoleTableProps) {
  const { enableAdvancedFilter, filterFlag } = useFeatureFlags();

  const [rowAction, setRowAction] = React.useState<DataTableRowAction<Role> | null>(null);
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

    const fetchData = React.useCallback(async () => {
    const { data } = await http.get<Role[]>("/roles/");
    return {
      data,                  // ✅ direct array
      totalCount: data.length // ✅ required by DataTable
    };
  }, []);

  const columns = React.useMemo(
    () =>
      geRoleTableColumns({
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
      sorting: [{ id: "created_at", desc: true }],
      columnPinning: { right: ["actions"] },
    },
  });

 

  const renderCardView = (data: Role[]) => {
    return<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((healthIssue) => (
        <Card key={healthIssue.id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {healthIssue.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">
              {healthIssue.name || "No description"}
            </p>
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>Created: {new Date(healthIssue.name).toLocaleDateString()}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRowAction({ row: { original: healthIssue } as any, variant: "update" })}
              >
                Edit
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  };

  return (
    <>
     {isLoading && <FullPageLoader />}
      <div className="flex justify-end mb-4">
        <div className="flex items-center gap-2">
          <CreateRoleDialog onSuccess={refetch}/>
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
          actionBar={<RoleTableActionBar table={table} />}
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

      <UpdateRole
        open={rowAction?.variant === "update"}
        onOpenChange={() => setRowAction(null)}
        role={rowAction?.row.original ?? null}
        onSuccess={refetch}
      />

      <DeleteRoleDialog
        open={rowAction?.variant === "delete"}
        onOpenChange={() => setRowAction(null)}
        role={rowAction?.row.original ? [rowAction.row.original] : []}
        showTrigger={false}
        onSuccess={() => {
          rowAction?.row.toggleSelected(false);
          refetch();
        }}
      />
    </>
  );
}