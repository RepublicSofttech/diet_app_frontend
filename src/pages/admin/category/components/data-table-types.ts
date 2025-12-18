import type { PaginationState, SortingState , VisibilityState  } from "@tanstack/react-table";
import React from "react";

// The shape of our main data entity
export interface Category {
    id: string;
    name: string;
    description: string;
    isApproved: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Defines a date range object for filtering
export type DateRange = {
    from?: Date;
    to?: Date;
};

// Defines the specific filters for the Categories table
export interface CategoryFilters {
  globalFilter?: string;
  isApproved?: "all" | "true" | "false";
}

// A generic, reusable type for the complete state of any data table
export interface DataTableState<T> {
  pagination: PaginationState;
  sorting: SortingState;
  filters: T;
  columnVisibility: VisibilityState;
}

// Configuration for rendering a single advanced filter control
export interface FilterConfig<T> {
  id: keyof T;
  label: string;
  component: React.ReactElement; 
}