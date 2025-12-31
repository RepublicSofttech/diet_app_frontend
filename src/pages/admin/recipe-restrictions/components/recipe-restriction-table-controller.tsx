"use client";

import * as React from "react";

import { DataTable } from "@/shared/components/data-table/data-table";
import { DataTableAdvancedToolbar } from "@/shared/components/data-table/data-table-advanced-toolbar";
import { DataTableFilterList } from "@/shared/components/data-table/data-table-filter-list";
import { DataTableSortList } from "@/shared/components/data-table/data-table-sort-list";

import type { HealthRecipeMappingUI } from "../api";
import { healthRecipeMappingApi } from "@/shared/api/recipe-restriction.api";
import { useDataTableController } from "@/shared/hooks/use-data-table-controller";
import type { DataTableRowAction, QueryKeys } from "@/shared/types/data-table";

import { getHealthMappingTableColumns } from "./recipe-restriction-table-columns";
import { CreateHealthMappingSheet } from "./create-recipe-restriction-dialog";
import { UpdateHealthRecipeMappingSheet } from "./update-recipe-restriction-dialog";
import { DeleteHealthRecipeMappingDialog } from "./delete-recipe-restriction-dialog";

import { HealthMappingTableActionBar } from "./recipe-restriction-table-action-bar";
interface HealthRecipeMappingTableProps {
  queryKeys?: Partial<QueryKeys>;
}

export function HealthRecipeMappingTable({
  queryKeys,
}: HealthRecipeMappingTableProps) {
  const [rowAction, setRowAction] =
    React.useState<DataTableRowAction<HealthRecipeMappingUI> | null>(null);

 

  const fetchData = React.useCallback(async (params: any) => {
    const result = await healthRecipeMappingApi.get({
      page: params.page,
      perPage: params.perPage,
      filters: params.filters,
      sorting: params.sorting,
    });

    console.log("sdfsdf ", result);
    return {
      data: result.data,
      totalCount: result.count,
    };
  }, []);

  const columns = React.useMemo(
    () => getHealthMappingTableColumns({ setRowAction }),
    []
  );

  const { table, refetch } = useDataTableController({
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
      {/* View Switcher */}
      <div className="mb-4 flex justify-end gap-2">
        <CreateHealthMappingSheet onSuccess={refetch} />
      </div>

      {/* Toolbar */}
      <DataTableAdvancedToolbar table={table}>
        <DataTableSortList table={table} align="start" />
        <DataTableFilterList table={table} align="start" />
      </DataTableAdvancedToolbar>

        <DataTable
          table={table}
          actionBar={
            <HealthMappingTableActionBar table={table} onSuccess={refetch} />
          }
        />

      {/* Dialogs */}
      <UpdateHealthRecipeMappingSheet
        open={rowAction?.variant === "update"}
        onOpenChange={() => setRowAction(null)}
        mapping={rowAction?.row.original ?? null}
        onSuccess={refetch}
      />

      <DeleteHealthRecipeMappingDialog
        open={rowAction?.variant === "delete"}
        onOpenChange={() => setRowAction(null)}
        // Change "mappings" to "mapping" and remove the brackets []
        mapping={rowAction?.row.original ?? null}
        onSuccess={refetch}
      />
    </>
  );
}
