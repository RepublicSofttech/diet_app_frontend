// "use client";

// import {
//   type ColumnFiltersState,
//   getCoreRowModel,
//   getFacetedMinMaxValues,
//   getFacetedRowModel,
//   getFacetedUniqueValues,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   type PaginationState,
//   type RowSelectionState,
//   type SortingState,
//   type TableOptions,
//   type TableState,
//   type Updater,
//   useReactTable,
//   type VisibilityState,
// } from "@tanstack/react-table";
// import {
//   parseAsArrayOf,
//   parseAsInteger,
//   parseAsString,
//   type SingleParser,
//   type UseQueryStateOptions,
//   useQueryState,
//   useQueryStates,
// } from "nuqs";
// import * as React from "react";

// import { useDebouncedCallback } from "./use-debounced-callback";
// import { getSortingStateParser } from "../lib/parsers";
// import type { ExtendedColumnSort, QueryKeys } from "../types/data-table";

// const PAGE_KEY = "page";
// const PER_PAGE_KEY = "perPage";
// const SORT_KEY = "sort";
// const FILTERS_KEY = "filters";
// const JOIN_OPERATOR_KEY = "joinOperator";
// const ARRAY_SEPARATOR = ",";
// const DEBOUNCE_MS = 300;
// const THROTTLE_MS = 50;

// interface UseSearchParamsTableOptions<TData> {
//   columns: TableOptions<TData>["columns"];
//   fetchData: (params: {
//     page: number;
//     perPage: number;
//     sorting: SortingState;
//     filters: any;
//   }) => Promise<{ data: TData[]; totalCount: number }>;
//   updateData?: (id: string, data: Partial<TData>) => Promise<TData>;
//   deleteData?: (id: string) => Promise<void>;
//   createData?: (data: Omit<TData, "id">) => Promise<TData>;
//   queryKeys?: Partial<QueryKeys>;
//   initialState?: Partial<TableState>;
//   enableAdvancedFilter?: boolean;
//   debounceMs?: number;
//   throttleMs?: number;
// }

// export function useSearchParamsTable<TData>({
//   columns,
//   fetchData,
//   updateData,
//   deleteData,
//   createData,
//   queryKeys = {},
//   initialState = {},
//   enableAdvancedFilter = false,
//   debounceMs = DEBOUNCE_MS,
//   throttleMs = THROTTLE_MS,
// }: UseSearchParamsTableOptions<TData>) {
//   const pageKey = queryKeys.page ?? PAGE_KEY;
//   const perPageKey = queryKeys.perPage ?? PER_PAGE_KEY;
//   const sortKey = queryKeys.sort ?? SORT_KEY;
//   const filtersKey = queryKeys.filters ?? FILTERS_KEY;

//   const queryStateOptions = {
//     throttleMs,
//     debounceMs,
//   };

//   const [rowSelection, setRowSelection] = React.useState<RowSelectionState>(
//     initialState.rowSelection ?? {}
//   );
//   const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(
//     initialState.columnVisibility ?? {}
//   );
//   const [data, setData] = React.useState<TData[]>([]);
//   const [pageCount, setPageCount] = React.useState(1);
//   const [isLoading, setIsLoading] = React.useState(false);

//   const [page, setPage] = useQueryState(
//     pageKey,
//     parseAsInteger.withOptions(queryStateOptions).withDefault(1)
//   );
//   const [perPage, setPerPage] = useQueryState(
//     perPageKey,
//     parseAsInteger.withOptions(queryStateOptions).withDefault(10)
//   );

//   const pagination: PaginationState = React.useMemo(() => ({
//     pageIndex: page - 1,
//     pageSize: perPage,
//   }), [page, perPage]);

//   const onPaginationChange = React.useCallback(
//     (updaterOrValue: Updater<PaginationState>) => {
//       if (typeof updaterOrValue === "function") {
//         const newPagination = updaterOrValue(pagination);
//         void setPage(newPagination.pageIndex + 1);
//         void setPerPage(newPagination.pageSize);
//       } else {
//         void setPage(updaterOrValue.pageIndex + 1);
//         void setPerPage(updaterOrValue.pageSize);
//       }
//     },
//     [pagination, setPage, setPerPage]
//   );

//   const columnIds = React.useMemo(() => {
//     return new Set(
//       columns.map((column) => column.id).filter(Boolean) as string[],
//     );
//   }, [columns]);

//   const [sorting, setSorting] = useQueryState(
//     sortKey,
//     getSortingStateParser<TData>(columnIds)
//       .withOptions(queryStateOptions)
//       .withDefault(initialState.sorting ?? [])
//   );

//   const onSortingChange = React.useCallback(
//     (updaterOrValue: Updater<SortingState>) => {
//       if (typeof updaterOrValue === "function") {
//         const newSorting = updaterOrValue(sorting);
//         setSorting(newSorting as ExtendedColumnSort<TData>[]);
//       } else {
//         setSorting(updaterOrValue as ExtendedColumnSort<TData>[]);
//       }
//     },
//     [sorting, setSorting]
//   );

//   const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
//     initialState.columnFilters ?? []
//   );

//   const onColumnFiltersChange = React.useCallback(
//     (updaterOrValue: Updater<ColumnFiltersState>) => {
//       if (typeof updaterOrValue === "function") {
//         const newFilters = updaterOrValue(columnFilters);
//         setColumnFilters(newFilters);
//       } else {
//         setColumnFilters(updaterOrValue);
//       }
//     },
//     [columnFilters]
//   );

//   // Fetch data
//   const loadData = React.useCallback(async () => {
//     setIsLoading(true);
//     try {
//       const result = await fetchData({
//         page,
//         perPage,
//         sorting,
//         filters: columnFilters,
//       });
//       setData(result.data);
//       setPageCount(Math.ceil(result.totalCount / perPage));
//     } catch (error) {
//       console.error("Failed to fetch data:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [page, perPage, sorting, columnFilters, fetchData]);

//   React.useEffect(() => {
//     loadData();
//   }, [loadData]);

//   const refetch = React.useCallback(() => {
//     loadData();
//   }, [loadData]);

//   // CRUD operations
//   const updateItem = React.useCallback(async (id: string, data: Partial<TData>) => {
//     if (!updateData || !data) return;
//     try {
//       const updatedItem = await updateData(id, data);
//       // For server-side operations, refetch to get updated data
//       await loadData();
//     } catch (error) {
//       console.error("Failed to update item:", error);
//       throw error;
//     }
//   }, [updateData, loadData]);

//   const deleteItem = React.useCallback(async (id: string) => {
//     if (!deleteData) return;
//     try {
//       await deleteData(id);
//       // For server-side operations, refetch to get updated data
//       await loadData();
//     } catch (error) {
//       console.error("Failed to delete item:", error);
//       throw error;
//     }
//   }, [deleteData, loadData]);

//   const createItem = React.useCallback(async (newData: Omit<TData, "id">) => {
//     if (!createData) return;
//     try {
//       const createdItem = await createData(newData);
//       // For server-side operations, refetch to get updated data
//       await loadData();
//     } catch (error) {
//       console.error("Failed to create item:", error);
//       throw error;
//     }
//   }, [createData, loadData]);

//   const table = useReactTable({
//     data,
//     columns,
//     pageCount,
//     state: {
//       pagination,
//       sorting,
//       columnVisibility,
//       rowSelection,
//       columnFilters,
//     },
//     enableRowSelection: true,
//     onRowSelectionChange: setRowSelection,
//     onPaginationChange,
//     onSortingChange,
//     onColumnVisibilityChange: setColumnVisibility,
//     onColumnFiltersChange,
//     getCoreRowModel: getCoreRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFacetedRowModel: getFacetedRowModel(),
//     getFacetedUniqueValues: getFacetedUniqueValues(),
//     getFacetedMinMaxValues: getFacetedMinMaxValues(),
//     manualPagination: true,
//     manualSorting: true,
//     manualFiltering: true,
//   });

//   return {
//     table,
//     data,
//     isLoading,
//     refetch,
//     updateItem,
//     deleteItem,
//     createItem,
//     setFilters: setColumnFilters,
//   };
// }