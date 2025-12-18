"use client";

import * as React from "react";
import { 
    type ColumnDef, 
    flexRender, 
    getCoreRowModel, 
    useReactTable, 
    type TableState 
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu";
import { ChevronLeft, ChevronRight, List, LayoutGrid, SlidersHorizontal } from "lucide-react";
import type { DataTableState, FilterConfig } from "./data-table-types"; // Assuming this path is correct

type ViewMode = "table" | "card";

interface ServerDataTableProps<TData, TFilters> {
  columns: ColumnDef<TData>[];
  data: TData[];
  totalItems: number;
  isLoading?: boolean;
  state: DataTableState<TFilters>;
  onStateChange: (state: DataTableState<TFilters>) => void;
  filterConfigs?: FilterConfig<TFilters>[];
  renderToolbarActions?: () => React.ReactNode;
  paginationOptions?: number[];
  renderCardView?: (data: TData[]) => React.ReactNode;
}

function ServerDataTableComponent<TData, TFilters>({
  columns, data, totalItems, isLoading = false, state, onStateChange,
  filterConfigs = [], renderToolbarActions, paginationOptions = [10, 20, 50],
  renderCardView
}: ServerDataTableProps<TData, TFilters>) {

  const { pagination, sorting, columnVisibility } = state;

  // Local state for the view mode, as it's a purely presentational concern.
  const [currentView, setCurrentView] = React.useState<ViewMode>("table");

  // This hook is memoized internally.
  const table = useReactTable({
    data,
    columns,
    // CRITICAL: All state aspects must be passed to the hook.
    state: { pagination, sorting, columnVisibility } as Partial<TableState>,
    getCoreRowModel: getCoreRowModel(),

    // Manual operations because data is server-driven.
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true, // Though we handle filters outside, this is good practice.
    pageCount: Math.ceil(totalItems / pagination.pageSize),
    
    // --- State Update Handlers ---
    onPaginationChange: (updater) => {
      const newPagination = typeof updater === "function" ? updater(pagination) : updater;
      onStateChange({ ...state, pagination: newPagination });
    },
    onSortingChange: (updater) => {
      const newSorting = typeof updater === "function" ? updater(sorting) : updater;
      onStateChange({ ...state, sorting: newSorting });
    },
    onColumnVisibilityChange: (updater) => {
        const newVisibility = typeof updater === 'function' ? updater(columnVisibility) : updater;
        onStateChange({ ...state, columnVisibility: newVisibility });
    },
  });

  const setPageSize = (size: number) => {
    onStateChange({ ...state, pagination: { ...pagination, pageSize: size, pageIndex: 0 } });
  };
  
  // Only enable card view if the render function is provided and there's data to show.
  const canRenderCardView = !!renderCardView && !isLoading && data.length > 0;

  return (
    <div>
      {/* --- Toolbar: Filters and Actions --- */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4">
        <div className="flex flex-wrap items-center gap-4">
          {filterConfigs.map(config => (
            <div key={String(config.id)} className="flex flex-col gap-1">
              <label className="text-sm font-medium text-muted-foreground">{config.label}</label>
              {config.component}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
            {renderToolbarActions && renderToolbarActions()}

            {/* Column Visibility (Show/Hide) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline"><SlidersHorizontal className="mr-2 h-4 w-4" /> View</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table.getAllColumns()
                  .filter(col => col.getCanHide())
                  .map(col => (
                    <DropdownMenuCheckboxItem
                        key={col.id}
                        className="capitalize"
                        checked={col.getIsVisible()}
                        onCheckedChange={(value) => col.toggleVisibility(!!value)}
                    >
                        {col.id}
                    </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* View Mode Switcher */}
            {canRenderCardView && (
                 <div className="flex items-center gap-1 rounded-md border p-1">
                    <Button variant={currentView === 'table' ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setCurrentView('table')}><List className="h-4 w-4" /></Button>
                    <Button variant={currentView === 'card' ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setCurrentView('card')}><LayoutGrid className="h-4 w-4" /></Button>
                </div>
            )}
        </div>
      </div>

      {/* --- Content Area: Renders either Table or Card View --- */}
      {currentView === 'card' && canRenderCardView ? (
        renderCardView(data)
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id}>
                  {hg.headers.map((header) => (
                    <TableHead key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? <TableRow><TableCell colSpan={columns.length} className="h-24 text-center">Loading...</TableCell></TableRow>
              : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                      ))}
                  </TableRow>
                ))
              ) : <TableRow><TableCell colSpan={columns.length} className="h-24 text-center">No results found.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </div>
      )}
       
       {/* --- Pagination --- */}
       <div className="flex items-center justify-between space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            Showing {table.getRowModel().rows.length} of {totalItems} rows.
          </div>
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select value={`${pagination.pageSize}`} onValueChange={(v) => setPageSize(Number(v))}>
              <SelectTrigger className="h-8 w-[70px]"><SelectValue /></SelectTrigger>
              <SelectContent side="top">
                {paginationOptions.map((size) => <SelectItem key={size} value={`${size}`}>{size}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Page {pagination.pageIndex + 1} of {table.getPageCount() > 0 ? table.getPageCount() : 1}
            </div>
            <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}><ChevronLeft className="h-4 w-4" /></Button>
            <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
    </div>
  )
}

/**
 * **CRITICAL**: Memoizing the component prevents it from re-rendering if its props
 * have not changed. This stops the headers, filters, and pagination from re-rendering
 * when only the `data` prop is updated after a fetch, providing a major performance boost.
 * The explicit generic type casting ensures TypeScript compatibility with this pattern.
 */
export const ServerDataTable = React.memo(ServerDataTableComponent) as <TData, TFilters>(
  props: ServerDataTableProps<TData, TFilters>
) => React.ReactElement;