"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import type { ColumnDef, Row } from "@tanstack/react-table";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { MoreHorizontal, Trash, Pencil } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu";

// --- Local Imports ---
import { ServerDataTable } from "./components/table";
import { DataTableColumnHeader } from "./components/data-table-helpers";
import type { DataTableState, Category, CategoryFilters, FilterConfig } from "./components/data-table-types";
import { fetchCategories, deleteCategory } from "./lib/dummy-api";
import { CategoryDialog } from "./components/category-dialog";


// --- Actions Cell Component ---
const ActionsCell = ({ row, onEdit, onDelete }: { row: Row<Category>, onEdit: (cat: Category) => void, onDelete: (catId: string) => void }) => {
    const category = row.original;
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(category)}><Pencil className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(category.id)} className="text-red-600"><Trash className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};


export default function CategoriesPage() {
    const [data, setData] = useState<Category[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [dialogState, setDialogState] = useState<{ isOpen: boolean; category: Category | null }>({ isOpen: false, category: null });

    // **CORRECTED**: Initial state now includes `columnVisibility`.
    const [tableState, setTableState] = useState<DataTableState<CategoryFilters>>({
        pagination: { pageIndex: 0, pageSize: 10 },
        sorting: [],
        filters: { globalFilter: "", isApproved: "all" },
        columnVisibility: {}, // <-- ADDED THIS
    });

    // The core data fetching logic, triggered by any state change
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const { pagination, sorting, filters } = tableState;
            const result = await fetchCategories(pagination, sorting, filters);
            setData(result.data);
            setTotalCount(result.totalCount);
        } catch (err) { console.error("Failed to fetch categories:", err); }
        finally { setIsLoading(false); }
    }, [tableState]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // **OPTIMIZED**: Wrapped in useCallback for performance.
    const handleFilterChange = useCallback(<K extends keyof CategoryFilters>(filterId: K, value: CategoryFilters[K]) => {
        setTableState(prevState => ({
            ...prevState,
            pagination: { ...prevState.pagination, pageIndex: 0 }, // Reset page on filter change
            filters: { ...prevState.filters, [filterId]: value },
        }));
    }, []);

    // **OPTIMIZED**: Wrapped in useCallback for performance.
    const handleDelete = useCallback(async (categoryId: string) => {
        // In a real app, use a more elegant confirmation modal (e.g., Shadcn's AlertDialog)
        if (confirm("Are you sure you want to delete this category?")) {
            await deleteCategory(categoryId);
            // In a real app, use a toast library for feedback
            alert("Category deleted successfully!");
            fetchData(); // Refetch data to show the change
        }
    }, [fetchData]); // Depends on `fetchData` to refetch after deletion

    // --- MEMOIZATION & CONFIGURATION ---

    const filterConfigs = useMemo<FilterConfig<CategoryFilters>[]>(() => [
        {
            id: "globalFilter",
            label: "Search",
            component: <Input placeholder="Name or description..." value={tableState.filters.globalFilter} onChange={(e) => handleFilterChange("globalFilter", e.target.value)} />,
        },
        {
            id: "isApproved",
            label: "Approval Status",
            component: <Select value={tableState.filters.isApproved} onValueChange={(v: "all" | "true" | "false") => handleFilterChange("isApproved", v)}>
                <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All</SelectItem><SelectItem value="true">Approved</SelectItem><SelectItem value="false">Not Approved</SelectItem>
                </SelectContent>
            </Select>,
        },
    ], [tableState.filters, handleFilterChange]);

    const columns = useMemo<ColumnDef<Category>[]>(() => [
        { accessorKey: "name", header: ({ column }) => <DataTableColumnHeader column={column} label="Name" />, enableHiding: false }, // Name cannot be hidden
        { accessorKey: "description", header: "Description", cell: ({ row }) => <div className="truncate max-w-xs">{row.original.description}</div> },
        { accessorKey: "isApproved", header: ({ column }) => <DataTableColumnHeader column={column} label="Status" />, cell: ({ row }) => row.original.isApproved ? "Approved" : "Pending" },
        { accessorKey: "createdAt", header: ({ column }) => <DataTableColumnHeader column={column} label="Created At" />, cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString() },
        { id: "actions", cell: ({ row }) => <ActionsCell row={row} onEdit={(cat) => setDialogState({ isOpen: true, category: cat })} onDelete={handleDelete} />, enableHiding: false },
    ], [handleDelete]); // Dependency array updated

    // **ADDED**: A memoized render function for the card view.
    const renderCardView = useCallback((categories: Category[]) => (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(cat => (
            <div key={cat.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg mb-1">{cat.name}</h3>
                   <ActionsCell row={{ original: cat } as Row<Category>} onEdit={(c) => setDialogState({ isOpen: true, category: c })} onDelete={handleDelete} />
              </div>
              <p className="text-sm text-muted-foreground mt-1 h-10 overflow-hidden">{cat.description}</p>
              <div className="mt-4 flex justify-between items-center">
                 <span className={`text-xs font-semibold px-2 py-1 rounded-full ${cat.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {cat.isApproved ? "Approved" : "Pending"}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(cat.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      ), [handleDelete]);


    const renderToolbarActions = useCallback(() => (
        <Button onClick={() => setDialogState({ isOpen: true, category: null })}>Add New Category</Button>
    ), []);

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Manage Categories</h1>

            <ServerDataTable
                columns={columns}
                data={data}
                totalItems={totalCount}
                isLoading={isLoading}
                state={tableState}
                onStateChange={setTableState}
                filterConfigs={filterConfigs}
                renderToolbarActions={renderToolbarActions}
                renderCardView={renderCardView} // <-- ADDED THIS PROP
            />

            <CategoryDialog
                isOpen={dialogState.isOpen}
                onClose={() => setDialogState({ isOpen: false, category: null })}
                category={dialogState.category}
                onSave={(data) => {
                    // Here you would call your create/update API
                    console.log("Saving data:", data);
                    alert("Data saved! (Check console)"); // Use toast
                    fetchData(); // Refetch after save
                }}
            />
        </div>
    );
}