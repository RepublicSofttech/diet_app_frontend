"use client";

import { useState, useEffect, useCallback } from "react";
import type { SortingState, PaginationState } from "@tanstack/react-table";

interface UseTableControllerOptions<TData, TFilters> {
  fetchData: (params: {
    pageIndex: number;
    pageSize: number;
    sorting: SortingState;
    filters: TFilters;
  }) => Promise<{ data: TData[]; totalCount: number }>;
  initialFilters: TFilters;
  initialSorting?: SortingState;
  initialPagination?: PaginationState;
}

export function useTableController<TData, TFilters>({
  fetchData,
  initialFilters,
  initialSorting = [],
  initialPagination = { pageIndex: 0, pageSize: 10 },
}: UseTableControllerOptions<TData, TFilters>) {
  const [data, setData] = useState<TData[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [tableState, setTableState] = useState({
    pagination: initialPagination,
    sorting: initialSorting,
    filters: initialFilters,
  });

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await fetchData({
        pageIndex: tableState.pagination.pageIndex,
        pageSize: tableState.pagination.pageSize,
        sorting: tableState.sorting,
        filters: tableState.filters,
      });
      setData(result.data);
      setTotalCount(result.totalCount);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [tableState, fetchData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const updateFilters = useCallback((newFilters: Partial<TFilters>) => {
    setTableState(prev => ({
      ...prev,
      pagination: { ...prev.pagination, pageIndex: 0 }, // Reset page
      filters: { ...prev.filters, ...newFilters },
    }));
  }, []);

  const updateSorting = useCallback((sorting: SortingState) => {
    setTableState(prev => ({ ...prev, sorting }));
  }, []);

  const updatePagination = useCallback((pagination: PaginationState) => {
    setTableState(prev => ({ ...prev, pagination }));
  }, []);

  return {
    data,
    totalCount,
    isLoading,
    tableState,
    updateFilters,
    updateSorting,
    updatePagination,
    refetch: loadData,
  };
}