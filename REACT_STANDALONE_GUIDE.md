# Complete React Table System Guide (Standalone React)

This guide provides comprehensive documentation for using and adapting the advanced data table system in standalone React applications (not Next.js App Router).

## Table of Contents
1. [Next.js vs Standalone React](#nextjs-vs-standalone-react)
2. [Core Dependencies](#core-dependencies)
3. [URL State Management in React](#url-state-management-in-react)
4. [Adapting Components for React](#adapting-components-for-react)
5. [**Creating Tables from Scratch**](#creating-tables-from-scratch)
6. [**Categories Table Implementation**](#categories-table-implementation)
7. [**Ingredients Table with Custom Hook**](#ingredients-table-with-custom-hook)
8. [**Advanced Filtering System**](#advanced-filtering-system)
9. [Complete React Implementation](#complete-react-implementation)
10. [Data Fetching Patterns](#data-fetching-patterns)
11. [Error Handling](#error-handling)
12. [Performance Optimization](#performance-optimization)
13. [Testing](#testing)
14. [Migration Examples](#migration-examples)

---

## Creating Tables from Scratch

This section provides step-by-step guides for creating data tables with advanced features including search, sorting, filtering, and CRUD operations.

### Prerequisites

Before creating tables, ensure you have these dependencies installed:

```json
{
  "dependencies": {
    "@tanstack/react-table": "^8.20.5",
    "nuqs": "^2.2.3",
    "react-hook-form": "^7.53.2",
    "zod": "^3.23.8",
    "@hookform/resolvers": "^3.9.1",
    "sonner": "^1.5.0",
    "lucide-react": "^0.460.0"
  }
}
```

### Project Structure

```
src/
├── pages/admin/
│   ├── categories/
│   │   ├── api.ts                    # API functions & types
│   │   ├── page.tsx                  # Page component
│   │   ├── components/
│   │   │   ├── categories-table-controller.tsx  # Main table (categories style)
│   │   │   ├── categories-table-columns.tsx     # Column definitions
│   │   │   ├── update-category-sheet.tsx        # Update form
│   │   │   └── delete-categories-dialog.tsx     # Delete dialog
│   │   └── lib/
│   │       └── validations.ts        # Form schemas
│   └── ingredients/
│       ├── api.ts                    # API functions & types
│       ├── page.tsx                  # Page component
│       ├── components/
│       │   ├── ingredients-table.tsx           # Main table (custom hook style)
│       │   ├── ingredients-table-columns.tsx   # Column definitions
│       │   ├── update-ingredient-sheet.tsx     # Update form
│       │   └── delete-ingredients-dialog.tsx   # Delete dialog
│       └── lib/
│           └── validations.ts        # Form schemas
├── shared/
│   ├── hooks/
│   │   ├── use-data-table-controller.ts    # Hook for categories-style tables
│   │   └── use-search-params-table.ts      # Hook for ingredients-style tables
│   ├── components/
│   │   ├── data-table/             # Reusable table components
│   │   └── ui/                     # UI components
│   └── types/
│       └── data-table.ts           # Type definitions
```

---

## Categories Table Implementation

The **Categories Table** uses the `useDataTableController` hook and follows a more traditional React pattern with server-side data fetching and advanced filtering.

### Step 1: Define Types & API

```typescript
// src/pages/admin/categories/api.ts
export interface Category {
  id: string;
  name: string;
  description: string | null;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  approvedBy: string | null;
}

// Mock data
let categories: Category[] = [
  {
    id: "1",
    name: "Electronics",
    description: "Electronic devices and accessories",
    isApproved: true,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    createdBy: "user1",
    approvedBy: "admin1",
  },
  // ... more data
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// GET /api/v1/categories/
export const getCategories = async (params?: {
  page?: number;
  perPage?: number;
  search?: string;
  filters?: any[];
}) => {
  await delay(500);

  const { page = 1, perPage = 10, search, filters } = params || {};
  let filteredCategories = categories;

  // Search functionality
  if (search) {
    filteredCategories = categories.filter(category =>
      category.name.toLowerCase().includes(search.toLowerCase()) ||
      (category.description && category.description.toLowerCase().includes(search.toLowerCase()))
    );
  }

  // Advanced filters
  if (filters && filters.length > 0) {
    filteredCategories = applyAdvancedFilters(filteredCategories, filters);
  }

  const total = filteredCategories.length;
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  const results = filteredCategories.slice(startIndex, endIndex);

  return {
    results,
    count: total,
    total_pages: Math.ceil(total / perPage),
    next: page < Math.ceil(total / perPage) ? page + 1 : null,
    previous: page > 1 ? page - 1 : null,
  };
};

// POST /api/v1/categories/
export const createCategory = async (data: {
  name: string;
  description?: string;
}) => {
  await delay(300);

  const newCategory: Category = {
    id: (categories.length + 1).toString(),
    name: data.name,
    description: data.description || null,
    isApproved: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: "current-user",
    approvedBy: null,
  };

  categories.push(newCategory);
  return newCategory;
};

// PUT /api/v1/categories/{id}/
export const updateCategory = async (id: string, data: Partial<Category>) => {
  await delay(300);

  const categoryIndex = categories.findIndex(cat => cat.id === id);
  if (categoryIndex === -1) throw new Error("Category not found");

  categories[categoryIndex] = { ...categories[categoryIndex], ...data, updatedAt: new Date().toISOString() };
  return categories[categoryIndex];
};

// DELETE /api/v1/categories/{id}/
export const deleteCategory = async (id: string) => {
  await delay(300);

  const categoryIndex = categories.findIndex(cat => cat.id === id);
  if (categoryIndex === -1) throw new Error("Category not found");

  categories.splice(categoryIndex, 1);
};

// Helper function for advanced filters
function applyAdvancedFilters(categories: Category[], filters: any[]) {
  return categories.filter(category => {
    return filters.every((filter: any) => {
      const { id, operator, value } = filter;
      const categoryValue = category[id as keyof Category];

      switch (operator) {
        case "iLike":
          return String(categoryValue).toLowerCase().includes(String(value).toLowerCase());
        case "eq":
          return categoryValue === value;
        case "ne":
          return categoryValue !== value;
        default:
          return true;
      }
    });
  });
}
```

### Step 2: Form Validations

```typescript
// src/pages/admin/categories/lib/validations.ts
import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

export type CreateCategorySchema = z.infer<typeof createCategorySchema>;
export type UpdateCategorySchema = z.infer<typeof updateCategorySchema>;
```

### Step 3: Table Columns

```typescript
// src/pages/admin/categories/components/categories-table-columns.tsx
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, CheckCircle, XCircle } from "lucide-react";
import * as React from "react";
import { DataTableColumnHeader } from "@/shared/components/data-table/data-table-column-header";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu";
import type { DataTableRowAction } from "@/shared/types/data-table";
import type { Category } from "../api";
import { formatDate } from "@/shared/lib/format";

interface GetCategoriesTableColumnsProps {
  setRowAction: React.Dispatch<React.SetStateAction<DataTableRowAction<Category> | null>>;
}

export function getCategoriesTableColumns({
  setRowAction,
}: GetCategoriesTableColumnsProps): ColumnDef<Category>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      ),
      enableSorting: false,
      size: 40,
    },
    {
      id: "name",
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} label="Name" />,
      cell: ({ row }) => <span className="font-medium">{row.getValue("name")}</span>,
      meta: {
        label: "Name",
        placeholder: "Search categories...",
        variant: "text",
      },
      enableColumnFilter: true,
    },
    {
      id: "description",
      accessorKey: "description",
      header: ({ column }) => <DataTableColumnHeader column={column} label="Description" />,
      cell: ({ row }) => (
        <span className="max-w-125 truncate text-muted-foreground">
          {row.getValue("description") || "No description"}
        </span>
      ),
    },
    {
      id: "isApproved",
      accessorKey: "isApproved",
      header: ({ column }) => <DataTableColumnHeader column={column} label="Status" />,
      cell: ({ cell }) => {
        const isApproved = cell.getValue<Category["isApproved"]>();
        return (
          <Badge variant={isApproved ? "default" : "secondary"}>
            {isApproved ? <CheckCircle className="mr-1 size-3" /> : <XCircle className="mr-1 size-3" />}
            {isApproved ? "Approved" : "Pending"}
          </Badge>
        );
      },
      meta: {
        label: "Status",
        options: [
          { label: "Approved", value: "true" },
          { label: "Pending", value: "false" },
        ],
        variant: "select",
      },
      enableColumnFilter: true,
      filterFn: (row, id, value) => {
        return value === "true" ? row.getValue(id) === true : row.getValue(id) === false;
      },
    },
    {
      id: "createdAt",
      accessorKey: "createdAt",
      header: ({ column }) => <DataTableColumnHeader column={column} label="Created" />,
      cell: ({ row }) => formatDate(row.getValue("createdAt")),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setRowAction({ row, variant: "update" })}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setRowAction({ row, variant: "delete" })}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}
```

### Step 4: Main Table Component

```typescript
// src/pages/admin/categories/components/categories-table-controller.tsx
"use client";

import * as React from "react";
import { toast } from "sonner";
import { List, LayoutGrid } from "lucide-react";
import { DataTable } from "@/shared/components/data-table/data-table";
import { DataTableAdvancedToolbar } from "@/shared/components/data-table/data-table-advanced-toolbar";
import { DataTableFilterList } from "@/shared/components/data-table/data-table-filter-list";
import { DataTableSortList } from "@/shared/components/data-table/data-table-sort-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import type { Category } from "../api";
import { useDataTableController } from "@/shared/hooks/use-data-table-controller";
import type { DataTableRowAction, QueryKeys } from "@/shared/types/data-table";
import { getCategories, updateCategory, deleteCategory } from "../api";
import { getCategoriesTableColumns } from "./categories-table-columns";
import { UpdateCategorySheet } from "./update-category-sheet";
import { DeleteCategoriesDialog } from "./delete-categories-dialog";

interface CategoriesTableProps {
  queryKeys?: Partial<QueryKeys>;
}

export function CategoriesTable({ queryKeys }: CategoriesTableProps) {
  const [rowAction, setRowAction] = React.useState<DataTableRowAction<Category> | null>(null);
  const [viewMode, setViewMode] = React.useState<"table" | "card">("table");

  const fetchData = React.useCallback(async (params: {
    page: number;
    perPage: number;
    sorting: any;
    filters: any;
  }) => {
    const result = await getCategories({
      page: params.page,
      perPage: params.perPage,
      filters: params.filters,
    });
    return { data: result.results, totalCount: result.count };
  }, []);

  const columns = React.useMemo(
    () => getCategoriesTableColumns({ setRowAction }),
    []
  );

  const { table, data, isLoading, setFilters, refetch } = useDataTableController({
    data: [], // Not needed since we fetch
    columns,
    pageCount: 1, // Will be updated
    enableAdvancedFilter: true,
    fetchData,
    queryKeys,
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
      columnPinning: { right: ["actions"] },
    },
  });

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
        <DataTable table={table}>
          <DataTableAdvancedToolbar table={table}>
            <DataTableSortList table={table} align="start" />
            <DataTableFilterList
              table={table}
              shallow={false}
              debounceMs={300}
              throttleMs={50}
              align="start"
            />
          </DataTableAdvancedToolbar>
        </DataTable>
      ) : (
        <div>
          <DataTableAdvancedToolbar table={table}>
            <DataTableSortList table={table} align="start" />
            <DataTableFilterList
              table={table}
              shallow={false}
              debounceMs={300}
              throttleMs={50}
              align="start"
            />
          </DataTableAdvancedToolbar>
          {renderCardView(data)}
          {/* Add pagination component here */}
        </div>
      )}

      <UpdateCategorySheet
        open={rowAction?.variant === "update"}
        onOpenChange={() => setRowAction(null)}
        category={rowAction?.row.original ?? null}
        onSuccess={refetch}
        onSubmit={async (data) => {
          if (rowAction?.row.original) {
            await updateCategory(rowAction.row.original.id, data);
            refetch();
          }
        }}
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
```

---

## Ingredients Table with Custom Hook

The **Ingredients Table** uses the `useSearchParamsTable` hook, which provides a more encapsulated approach with built-in CRUD operations.

### Step 1: Define Types & API

```typescript
// src/pages/admin/ingredients/api.ts
export interface Ingredient {
  id: string;
  name: string;
  description: string | null;
  category: string;
  unit: string;
  price: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Mock data
let ingredients: Ingredient[] = [
  {
    id: "1",
    name: "Tomato",
    description: "Fresh red tomatoes",
    category: "Vegetables",
    unit: "kg",
    price: 2.5,
    isActive: true,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  // ... more data
];

// GET /api/v1/ingredients/
export const getIngredients = async (params?: {
  page?: number;
  perPage?: number;
  search?: string;
  filters?: any[];
  sorting?: any[];
}) => {
  await delay(500);

  const { page = 1, perPage = 10, search, filters, sorting } = params || {};
  let filteredIngredients = ingredients;

  // Search
  if (search) {
    filteredIngredients = ingredients.filter(ingredient =>
      ingredient.name.toLowerCase().includes(search.toLowerCase()) ||
      (ingredient.description && ingredient.description.toLowerCase().includes(search.toLowerCase())) ||
      ingredient.category.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Advanced filters
  if (filters && filters.length > 0) {
    filteredIngredients = ingredients.filter(ingredient => {
      return filters.every((filter: any) => {
        const { id, operator, value } = filter;
        const ingredientValue = ingredient[id as keyof Ingredient];

        switch (operator) {
          case "iLike":
            return String(ingredientValue).toLowerCase().includes(String(value).toLowerCase());
          case "eq":
            return ingredientValue === value;
          case "ne":
            return ingredientValue !== value;
          case "gt":
            return Number(ingredientValue) > Number(value);
          case "lt":
            return Number(ingredientValue) < Number(value);
          default:
            return true;
        }
      });
    });
  }

  // Sorting
  if (sorting && sorting.length > 0) {
    filteredIngredients = [...filteredIngredients].sort((a, b) => {
      for (const sort of sorting) {
        const { id, desc } = sort;
        const aValue = a[id as keyof Ingredient];
        const bValue = b[id as keyof Ingredient];

        let comparison = 0;
        if (aValue < bValue) comparison = -1;
        if (aValue > bValue) comparison = 1;

        if (comparison !== 0) {
          return desc ? -comparison : comparison;
        }
      }
      return 0;
    });
  }

  const total = filteredIngredients.length;
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  const results = filteredIngredients.slice(startIndex, endIndex);

  return {
    results,
    count: total,
    total_pages: Math.ceil(total / perPage),
    next: page < Math.ceil(total / perPage) ? page + 1 : null,
    previous: page > 1 ? page - 1 : null,
  };
};

// POST /api/v1/ingredients/
export const createIngredient = async (data: {
  name: string;
  description: string | null;
  category: string;
  unit: string;
  price: number;
  isActive: boolean;
}) => {
  await delay(300);

  const newIngredient: Ingredient = {
    id: (ingredients.length + 1).toString(),
    name: data.name,
    description: data.description,
    category: data.category,
    unit: data.unit,
    price: data.price,
    isActive: data.isActive,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  ingredients.push(newIngredient);
  return newIngredient;
};

// PUT /api/v1/ingredients/{id}/
export const updateIngredient = async (id: string, data: Partial<{
  name: string;
  description: string | null;
  category: string;
  unit: string;
  price: number;
  isActive: boolean;
}>) => {
  await delay(300);

  const ingredientIndex = ingredients.findIndex(ing => ing.id === id);
  if (ingredientIndex === -1) throw new Error("Ingredient not found");

  ingredients[ingredientIndex] = { ...ingredients[ingredientIndex], ...data, updatedAt: new Date().toISOString() };
  return ingredients[ingredientIndex];
};

// DELETE /api/v1/ingredients/{id}/
export const deleteIngredient = async (id: string) => {
  await delay(300);

  const ingredientIndex = ingredients.findIndex(ing => ing.id === id);
  if (ingredientIndex === -1) throw new Error("Ingredient not found");

  ingredients.splice(ingredientIndex, 1);
};
```

### Step 2: Form Validations

```typescript
// src/pages/admin/ingredients/lib/validations.ts
import { z } from "zod";

export const createIngredientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().nullable(),
  category: z.string().min(1, "Category is required"),
  unit: z.string().min(1, "Unit is required"),
  price: z.number().min(0, "Price must be positive"),
  isActive: z.boolean().optional(),
});

export const updateIngredientSchema = createIngredientSchema.partial();

export type CreateIngredientSchema = z.infer<typeof createIngredientSchema>;
export type UpdateIngredientSchema = z.infer<typeof updateIngredientSchema>;
```

### Step 3: Table Columns

```typescript
// src/pages/admin/ingredients/components/ingredients-table-columns.tsx
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, CheckCircle, XCircle } from "lucide-react";
import * as React from "react";
import { DataTableColumnHeader } from "@/shared/components/data-table/data-table-column-header";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu";
import type { DataTableRowAction } from "@/shared/types/data-table";
import type { Ingredient } from "../api";

interface GetIngredientsTableColumnsProps {
  setRowAction: React.Dispatch<React.SetStateAction<DataTableRowAction<Ingredient> | null>>;
}

export function getIngredientsTableColumns({
  setRowAction,
}: GetIngredientsTableColumnsProps): ColumnDef<Ingredient>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      ),
      enableSorting: false,
      size: 40,
    },
    {
      id: "name",
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} label="Name" />,
      cell: ({ row }) => <span className="font-medium">{row.getValue("name")}</span>,
      meta: {
        label: "Name",
        placeholder: "Search ingredients...",
        variant: "text",
      },
      enableColumnFilter: true,
    },
    {
      id: "category",
      accessorKey: "category",
      header: ({ column }) => <DataTableColumnHeader column={column} label="Category" />,
      cell: ({ row }) => <span className="capitalize">{row.getValue("category")}</span>,
      meta: {
        label: "Category",
        placeholder: "Filter categories...",
        variant: "text",
      },
      enableColumnFilter: true,
    },
    {
      id: "unit",
      accessorKey: "unit",
      header: ({ column }) => <DataTableColumnHeader column={column} label="Unit" />,
      cell: ({ row }) => <span>{row.getValue("unit")}</span>,
      meta: {
        label: "Unit",
        placeholder: "Filter units...",
        variant: "text",
      },
      enableColumnFilter: true,
    },
    {
      id: "price",
      accessorKey: "price",
      header: ({ column }) => <DataTableColumnHeader column={column} label="Price" />,
      cell: ({ row }) => <span>${(row.getValue("price") as number).toFixed(2)}</span>,
      meta: {
        label: "Price",
        variant: "number",
        unit: "$",
      },
      enableColumnFilter: true,
    },
    {
      id: "isActive",
      accessorKey: "isActive",
      header: ({ column }) => <DataTableColumnHeader column={column} label="Status" />,
      cell: ({ cell }) => {
        const isActive = cell.getValue<Ingredient["isActive"]>();
        return (
          <Badge variant={isActive ? "default" : "secondary"}>
            {isActive ? <CheckCircle className="mr-1 size-3" /> : <XCircle className="mr-1 size-3" />}
            {isActive ? "Active" : "Inactive"}
          </Badge>
        );
      },
      meta: {
        label: "Status",
        options: [
          { label: "Active", value: "true" },
          { label: "Inactive", value: "false" },
        ],
        variant: "select",
      },
      enableColumnFilter: true,
      filterFn: (row, id, value) => {
        return value === "true" ? row.getValue(id) === true : row.getValue(id) === false;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setRowAction({ row, variant: "update" })}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setRowAction({ row, variant: "delete" })}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        ),
    },
  ];
}
```

### Step 4: Main Table Component

```typescript
// src/pages/admin/ingredients/components/ingredients-table.tsx
"use client";

import * as React from "react";
import { toast } from "sonner";
import { List, LayoutGrid } from "lucide-react";
import { DataTable } from "@/shared/components/data-table/data-table";
import { DataTableAdvancedToolbar } from "@/shared/components/data-table/data-table-advanced-toolbar";
import { DataTableFilterList } from "@/shared/components/data-table/data-table-filter-list";
import { DataTableSortList } from "@/shared/components/data-table/data-table-sort-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import type { Ingredient } from "../api";
import { useSearchParamsTable } from "@/shared/hooks/use-search-params-table";
import type { DataTableRowAction, QueryKeys } from "@/shared/types/data-table";
import { getIngredients, updateIngredient, deleteIngredient, createIngredient } from "../api";
import { getIngredientsTableColumns } from "./ingredients-table-columns";
import { UpdateIngredientSheet } from "./update-ingredient-sheet";
import { DeleteIngredientsDialog } from "./delete-ingredients-dialog";

interface IngredientsTableProps {
  queryKeys?: Partial<QueryKeys>;
}

export function IngredientsTable({ queryKeys }: IngredientsTableProps) {
  const [rowAction, setRowAction] = React.useState<DataTableRowAction<Ingredient> | null>(null);
  const [viewMode, setViewMode] = React.useState<"table" | "card">("table");

  const fetchData = React.useCallback(async (params: {
    page: number;
    perPage: number;
    sorting: any;
    filters: any;
  }) => {
    const result = await getIngredients({
      page: params.page,
      perPage: params.perPage,
      filters: params.filters,
      sorting: params.sorting,
    });
    return { data: result.results, totalCount: result.count };
  }, []);

  const columns = React.useMemo(
    () => getIngredientsTableColumns({ setRowAction }),
    []
  );

  const {
    table,
    data,
    isLoading,
    refetch,
    updateItem,
    deleteItem,
    createItem,
    setFilters,
  } = useSearchParamsTable<Ingredient>({
    columns,
    fetchData,
    updateData: updateIngredient,
    deleteData: deleteIngredient,
    createData: createIngredient,
    queryKeys,
    enableAdvancedFilter: true,
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
      columnPinning: { right: ["actions"] },
    },
  });

  const renderCardView = (data: Ingredient[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((ingredient) => (
        <Card key={ingredient.id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {ingredient.name}
              <Badge variant={ingredient.isActive ? "default" : "secondary"}>
                {ingredient.isActive ? "Active" : "Inactive"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">
              {ingredient.description || "No description"}
            </p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div>Category: {ingredient.category}</div>
              <div>Unit: {ingredient.unit}</div>
              <div>Price: ${ingredient.price.toFixed(2)}</div>
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
        <DataTable table={table}>
          <DataTableAdvancedToolbar table={table}>
            <DataTableSortList table={table} align="start" />
            <DataTableFilterList
              table={table}
              shallow={false}
              debounceMs={300}
              throttleMs={50}
              align="start"
            />
          </DataTableAdvancedToolbar>
        </DataTable>
      ) : (
        <div>
          <DataTableAdvancedToolbar table={table}>
            <DataTableSortList table={table} align="start" />
            <DataTableFilterList
              table={table}
              shallow={false}
              debounceMs={300}
              throttleMs={50}
              align="start"
            />
          </DataTableAdvancedToolbar>
          {renderCardView(data)}
          {/* Add pagination component here */}
        </div>
      )}

      <UpdateIngredientSheet
        open={rowAction?.variant === "update"}
        onOpenChange={() => setRowAction(null)}
        ingredient={rowAction?.row.original ?? null}
        onSuccess={refetch}
        onSubmit={async (data) => {
          if (rowAction?.row.original) {
            await updateItem(rowAction.row.original.id, data);
          }
        }}
      />

      <DeleteIngredientsDialog
        open={rowAction?.variant === "delete"}
        onOpenChange={() => setRowAction(null)}
        ingredients={rowAction?.row.original ? [rowAction.row.original] : []}
        showTrigger={false}
        onSuccess={async () => {
          if (rowAction?.row.original) {
            await deleteItem(rowAction.row.original.id);
          }
          rowAction?.row.toggleSelected(false);
        }}
      />
    </>
  );
}
```

---

## Advanced Filtering System

Both table implementations support advanced filtering through the `DataTableFilterList` and `DataTableFilterMenu` components.

### How Advanced Filters Work

1. **Column Metadata**: Each column can have filter metadata:
```typescript
meta: {
  label: "Name",
  placeholder: "Search names...",
  variant: "text", // text, number, select, multiSelect, date, dateRange
  options: [{ label: "Active", value: "true" }], // for select/multiSelect
  unit: "$", // for number inputs
},
enableColumnFilter: true,
```

2. **Filter Operators**: The system supports various operators:
   - `iLike`: Case-insensitive string matching
   - `eq`: Equal to
   - `ne`: Not equal to
   - `gt`: Greater than
   - `lt`: Less than
   - `gte`: Greater than or equal
   - `lte`: Less than or equal

3. **URL State Management**: Filters are stored in URL parameters and persist across page reloads.

4. **Server-side Processing**: Filters are processed on the server for accurate results.

### Enabling Advanced Filters

For **Categories Table** (`useDataTableController`):
```typescript
const { table, data, isLoading, setFilters, refetch } = useDataTableController({
  // ... other options
  enableAdvancedFilter: true, // Enable advanced filtering
  fetchData,
  // ...
});
```

For **Ingredients Table** (`useSearchParamsTable`):
```typescript
const { table, data, isLoading, refetch, updateItem, deleteItem, createItem, setFilters } = useSearchParamsTable({
  // ... other options
  enableAdvancedFilter: true, // Enable advanced filtering
  fetchData,
  // ...
});
```

### Filter Components

The system provides several filter components:

- **`DataTableFilterList`**: Shows all available filters in a horizontal list
- **`DataTableFilterMenu`**: Shows filters in a dropdown menu
- **`DataTableAdvancedToolbar`**: Container that includes sorting and filtering

### Custom Filter Functions

For complex filtering logic, you can define custom filter functions:

```typescript
{
  id: "isActive",
  accessorKey: "isActive",
  // ... other column config
  filterFn: (row, id, value) => {
    return value === "true" ? row.getValue(id) === true : row.getValue(id) === false;
  },
},
```

### Filter Persistence

Filters are automatically persisted in the URL and restored when the page loads. The `nuqs` library handles serialization and deserialization of complex filter objects.

### Performance Considerations

- Filters are debounced to prevent excessive API calls
- Server-side filtering ensures accurate results for large datasets
- URL state management allows bookmarking filtered views

---

## Key Differences: Categories vs Ingredients Approach

| Feature | Categories Table | Ingredients Table |
|---------|------------------|-------------------|
| **Hook Used** | `useDataTableController` | `useSearchParamsTable` |
| **Data Fetching** | Manual in component | Built into hook |
| **CRUD Operations** | Manual implementation | Built into hook |
| **State Management** | Component-level | Hook-level |
| **Complexity** | Lower (more control) | Higher (more abstraction) |
| **Flexibility** | Higher | Lower |
| **Best For** | Complex business logic | Standard CRUD tables |

Choose the **Categories approach** when you need:
- Custom business logic
- Complex state management
- More control over data flow

Choose the **Ingredients approach** when you need:
- Quick setup
- Standard CRUD operations
- Less boilerplate code

Both approaches support advanced filtering, sorting, search, and card/table views.

## Table of Contents
1. [Next.js vs Standalone React](#nextjs-vs-standalone-react)
2. [Core Dependencies](#core-dependencies)
3. [URL State Management in React](#url-state-management-in-react)
4. [Adapting Components for React](#adapting-components-for-react)
5. [Complete React Implementation](#complete-react-implementation)
6. [Data Fetching Patterns](#data-fetching-patterns)
7. [Error Handling](#error-handling)
8. [Performance Optimization](#performance-optimization)
9. [Testing](#testing)
10. [Migration Examples](#migration-examples)

## Next.js vs Standalone React

### **Next.js App Router (Current Implementation)**
```tsx
// app/categories/page.tsx
export default function CategoriesPage({ searchParams }: CategoriesPageProps) {
  // searchParams automatically provided by Next.js
  return <CategoriesTableWrapper searchParams={searchParams} />;
}
```

### **Standalone React (What You Need)**
```tsx
// components/CategoriesPage.tsx
export function CategoriesPage() {
  // You manage searchParams yourself
  const searchParams = useSearchParams();
  return <CategoriesTableWrapper searchParams={searchParams} />;
}
```

## Core Dependencies

### **Required Packages**
```json
{
  "dependencies": {
    "@tanstack/react-table": "^8.20.5",
    "@tanstack/react-query": "^5.59.0", // For data fetching
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.460.0", // Icons
    "sonner": "^1.5.0", // Toast notifications
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.4"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.6.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

### **Additional Packages for URL Management**
```json
{
  "dependencies": {
    "nuqs": "^2.2.3", // URL state management (recommended)
    // OR
    "react-router-dom": "^6.28.0", // Alternative routing
    "query-string": "^9.1.0" // Alternative URL parsing
  }
}
```

## URL State Management in React

### **Option 1: nuqs (Recommended - Same as Next.js)**
```tsx
import { createSearchParamsCache, parseAsInteger, parseAsStringEnum } from "nuqs";
import { useQueryStates } from "nuqs";

// Create search params cache (same as Next.js)
export const searchParamsCache = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  sort: getSortingStateParser().withDefault([{ id: "createdAt", desc: true }]),
  filters: getFiltersStateParser().withDefault([]),
  joinOperator: parseAsStringEnum(["and", "or"]).withDefault("and"),
});

// Hook to get parsed search params
export function useSearchParams() {
  const [params] = useQueryStates(searchParamsCache.parsers);
  return params;
}

// Usage in component
function CategoriesPage() {
  const searchParams = useSearchParams();
  return <CategoriesTableWrapper searchParams={searchParams} />;
}
```

### **Option 2: React Router**
```tsx
import { useSearchParams } from "react-router-dom";
import { parseAsInteger, parseAsString } from "nuqs";

function useParsedSearchParams() {
  const [searchParams] = useSearchParams();

  return {
    page: parseAsInteger.parse(searchParams.get("page")) ?? 1,
    perPage: parseAsInteger.parse(searchParams.get("perPage")) ?? 10,
    // Parse other params...
  };
}
```

### **Option 3: Custom Hook**
```tsx
import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import queryString from "query-string";

function useSearchParams() {
  const location = useLocation();

  return useMemo(() => {
    const parsed = queryString.parse(location.search, {
      parseNumbers: true,
      parseBooleans: true,
      arrayFormat: "bracket",
    });

    return {
      page: parsed.page || 1,
      perPage: parsed.perPage || 10,
      sort: parsed.sort ? JSON.parse(parsed.sort) : [{ id: "createdAt", desc: true }],
      filters: parsed.filters ? JSON.parse(parsed.filters) : [],
      // ... other params
    };
  }, [location.search]);
}
```

## Adapting Components for React

### **1. Page Component Adaptation**
```tsx
// ❌ Next.js App Router (doesn't work in React)
export default function CategoriesPage({ searchParams }: CategoriesPageProps) {
  // Error: searchParams not provided
}

// ✅ Standalone React
import { useSearchParams } from "./hooks/use-search-params";

export function CategoriesPage() {
  const searchParams = useSearchParams();

  return (
    <Suspense fallback={<Skeleton />}>
      <CategoriesTableWrapper searchParams={searchParams} />
    </Suspense>
  );
}
```

### **2. Wrapper Component Adaptation**
```tsx
// ✅ Works in both Next.js and React
async function CategoriesTableWrapper({ searchParams }: { searchParams: any }) {
  const validFilters = getValidFilters(searchParams.filters);
  const enableAdvancedFilter = searchParams.filterFlag === "advancedFilters";

  const promises = Promise.all([
    getCategories({
      page: searchParams.page,
      perPage: searchParams.perPage,
      ...(enableAdvancedFilter ? { filters: validFilters } : {}),
    }),
    getCategoryApprovalCounts(),
  ]);

  return <CategoriesTable promises={promises} />;
}
```

### **3. Data Fetching with React Query**
```tsx
import { useQuery } from "@tanstack/react-query";

function CategoriesTableWrapper({ searchParams }: { searchParams: any }) {
  const validFilters = getValidFilters(searchParams.filters);
  const enableAdvancedFilter = searchParams.filterFlag === "advancedFilters";

  // Use React Query instead of promises
  const { data: categoriesData, isLoading } = useQuery({
    queryKey: ["categories", searchParams],
    queryFn: () => getCategories({
      page: searchParams.page,
      perPage: searchParams.perPage,
      ...(enableAdvancedFilter ? { filters: validFilters } : {}),
    }),
  });

  const { data: approvalCounts } = useQuery({
    queryKey: ["category-approval-counts"],
    queryFn: getCategoryApprovalCounts,
  });

  if (isLoading) return <Skeleton />;

  return <CategoriesTable data={categoriesData} stats={approvalCounts} />;
}
```

## Complete React Implementation

### **1. Project Setup**
```bash
# Create React app
npx create-react-app my-table-app --template typescript
cd my-table-app

# Install dependencies
npm install @tanstack/react-table @tanstack/react-query lucide-react sonner
npm install nuqs class-variance-authority clsx tailwind-merge
npm install -D tailwindcss autoprefixer postcss

# Setup Tailwind
npx tailwindcss init -p
```

### **2. Tailwind Configuration**
```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        // Add your color variables
      },
    },
  },
  plugins: [],
}
```

### **3. Main App Component**
```tsx
// src/App.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { FeatureFlagsProvider } from "./components/feature-flags-provider";
import CategoriesPage from "./pages/CategoriesPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <FeatureFlagsProvider>
          <CategoriesPage />
        </FeatureFlagsProvider>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
```

### **4. Search Params Hook**
```tsx
// src/hooks/use-search-params.ts
import { createSearchParamsCache, parseAsInteger, parseAsStringEnum } from "nuqs";
import { useQueryStates } from "nuqs";
import { getFiltersStateParser, getSortingStateParser } from "../lib/parsers";

export const searchParamsCache = createSearchParamsCache({
  filterFlag: parseAsStringEnum(["advancedFilters", "commandFilters"]),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  sort: getSortingStateParser().withDefault([{ id: "createdAt", desc: true }]),
  filters: getFiltersStateParser().withDefault([]),
  joinOperator: parseAsStringEnum(["and", "or"]).withDefault("and"),
});

export function useSearchParams() {
  const [params] = useQueryStates(searchParamsCache.parsers);
  return params;
}

export type SearchParams = ReturnType<typeof useSearchParams>;
```

### **5. Page Component**
```tsx
// src/pages/CategoriesPage.tsx
import { Suspense } from "react";
import { DataTableSkeleton } from "../components/data-table/data-table-skeleton";
import { useSearchParams } from "../hooks/use-search-params";
import { CategoriesTableWrapper } from "../components/categories/CategoriesTableWrapper";

export default function CategoriesPage() {
  const searchParams = useSearchParams();

  return (
    <div className="container mx-auto py-8">
      <Suspense
        fallback={
          <DataTableSkeleton
            columnCount={5}
            filterCount={1}
            cellWidths={["10rem", "20rem", "20rem", "10rem", "10rem", "10rem"]}
            shrinkZero
          />
        }
      >
        <CategoriesTableWrapper searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
```

### **6. Table Wrapper Component**
```tsx
// src/components/categories/CategoriesTableWrapper.tsx
import { useQuery } from "@tanstack/react-query";
import { getValidFilters } from "../../lib/data-table";
import { getCategories, getCategoryApprovalCounts } from "../../lib/categories-api";
import { CategoriesTable } from "./CategoriesTable";

interface CategoriesTableWrapperProps {
  searchParams: any;
}

export function CategoriesTableWrapper({ searchParams }: CategoriesTableWrapperProps) {
  const validFilters = getValidFilters(searchParams.filters);
  const enableAdvancedFilter = searchParams.filterFlag === "advancedFilters";

  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories", searchParams],
    queryFn: () => getCategories({
      page: searchParams.page,
      perPage: searchParams.perPage,
      ...(enableAdvancedFilter ? { filters: validFilters } : {}),
    }),
  });

  const { data: approvalCounts, isLoading: isLoadingStats } = useQuery({
    queryKey: ["category-approval-counts"],
    queryFn: getCategoryApprovalCounts,
  });

  if (isLoadingCategories || isLoadingStats) {
    return <div>Loading...</div>;
  }

  return (
    <CategoriesTable
      data={categoriesData}
      stats={approvalCounts}
    />
  );
}
```

### **7. Table Component**
```tsx
// src/components/categories/CategoriesTable.tsx
import { useMemo } from "react";
import { DataTable } from "../data-table/data-table";
import { DataTableAdvancedToolbar } from "../data-table/data-table-advanced-toolbar";
import { DataTableFilterList } from "../data-table/data-table-filter-list";
import { DataTableToolbar } from "../data-table/data-table-toolbar";
import { useDataTable } from "../../hooks/use-data-table";
import { useFeatureFlags } from "../feature-flags-provider";
import { CategoriesTableActionBar } from "./CategoriesTableActionBar";
import { getCategoriesTableColumns } from "./categories-table-columns";

interface CategoriesTableProps {
  data: {
    results: any[];
    count: number;
    total_pages: number;
  };
  stats: Record<string, number>;
}

export function CategoriesTable({ data, stats }: CategoriesTableProps) {
  const { enableAdvancedFilter, filterFlag } = useFeatureFlags();

  const columns = useMemo(
    () => getCategoriesTableColumns({ approvalCounts: stats }),
    [stats],
  );

  const { table, shallow, debounceMs, throttleMs } = useDataTable({
    data: data.results,
    columns,
    pageCount: data.total_pages,
    enableAdvancedFilter,
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
      columnPinning: { right: ["actions"] },
    },
  });

  return (
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
    </DataTable>
  );
}
```

## Data Fetching Patterns

### **1. React Query (Recommended)**
```tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

function useCategories(searchParams: any) {
  return useQuery({
    queryKey: ["categories", searchParams],
    queryFn: () => getCategories(searchParams),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}
```

### **2. SWR (Alternative)**
```tsx
import useSWR from "swr";

function CategoriesTableWrapper({ searchParams }) {
  const { data, error, isLoading } = useSWR(
    ["categories", searchParams],
    ([, params]) => getCategories(params)
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <CategoriesTable data={data} />;
}
```

### **3. Custom Hook with State**
```tsx
function useCategories(searchParams: any) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories(searchParams).then(setData).finally(() => setLoading(false));
  }, [searchParams]);

  return { data, loading };
}
```

## Error Handling

### **1. Query Error Boundaries**
```tsx
import { ErrorBoundary } from "react-error-boundary";

function App() {
  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <QueryClientProvider client={queryClient}>
        {/* Your app */}
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
```

### **2. Loading States**
```tsx
function CategoriesTableWrapper({ searchParams }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["categories", searchParams],
    queryFn: () => getCategories(searchParams),
  });

  if (isLoading) return <DataTableSkeleton />;
  if (error) return <div>Error: {error.message}</div>;

  return <CategoriesTable data={data} />;
}
```

### **3. Optimistic Updates**
```tsx
const createCategoryMutation = useMutation({
  mutationFn: createCategory,
  onMutate: async (newCategory) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ["categories"] });

    // Snapshot previous value
    const previousCategories = queryClient.getQueryData(["categories"]);

    // Optimistically update
    queryClient.setQueryData(["categories"], (old) => [...old, newCategory]);

    return { previousCategories };
  },
  onError: (err, newCategory, context) => {
    // Revert on error
    queryClient.setQueryData(["categories"], context.previousCategories);
  },
  onSettled: () => {
    // Refetch
    queryClient.invalidateQueries({ queryKey: ["categories"] });
  },
});
```

## Performance Optimization

### **1. Memoization**
```tsx
const columns = useMemo(
  () => getCategoriesTableColumns({ approvalCounts }),
  [approvalCounts]
);

const filteredData = useMemo(
  () => applyFilters(data, filters),
  [data, filters]
);
```

### **2. Virtualization**
```tsx
import { useVirtualizer } from "@tanstack/react-virtual";

function VirtualizedTable({ data }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
  });

  return (
    <div ref={parentRef} style={{ height: "400px", overflow: "auto" }}>
      <div style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              height: virtualItem.size,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {/* Your row component */}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### **3. Debounced Search**
```tsx
import { useDebouncedCallback } from "use-debounce";

function SearchInput() {
  const [value, setValue] = useState("");
  const debouncedSetFilters = useDebouncedCallback(setFilters, 300);

  const handleChange = (newValue: string) => {
    setValue(newValue);
    debouncedSetFilters({ id: "name", value: newValue });
  };

  return <input value={value} onChange={handleChange} />;
}
```

## Testing

### **1. Component Testing**
```tsx
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CategoriesTable } from "./CategoriesTable";

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

test("renders categories table", () => {
  const mockData = { results: [], count: 0, total_pages: 0 };

  render(<CategoriesTable data={mockData} stats={{}} />, {
    wrapper: createWrapper(),
  });

  expect(screen.getByRole("table")).toBeInTheDocument();
});
```

### **2. Hook Testing**
```tsx
import { renderHook } from "@testing-library/react";
import { useDataTable } from "./use-data-table";

test("useDataTable returns table instance", () => {
  const { result } = renderHook(() =>
    useDataTable({
      data: [],
      columns: [],
      pageCount: 1,
    })
  );

  expect(result.current.table).toBeDefined();
});
```

### **3. API Testing**
```tsx
import { rest } from "msw";
import { setupServer } from "msw/node";

const server = setupServer(
  rest.get("/api/categories", (req, res, ctx) => {
    return res(ctx.json({ results: [], count: 0, total_pages: 0 }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

## Migration Examples

### **From Next.js to React**
```tsx
// Before (Next.js)
export default function CategoriesPage({ searchParams }: CategoriesPageProps) {
  return <CategoriesTableWrapper searchParams={searchParams} />;
}

// After (React)
export function CategoriesPage() {
  const searchParams = useSearchParams();
  return <CategoriesTableWrapper searchParams={searchParams} />;
}
```

### **From Promises to React Query**
```tsx
// Before
const promises = Promise.all([getCategories(params), getStats()]);
const [data, stats] = await Promise.all(promises);

// After
const { data } = useQuery({
  queryKey: ["categories", params],
  queryFn: () => getCategories(params),
});

const { data: stats } = useQuery({
  queryKey: ["stats"],
  queryFn: getStats,
});
```

### **From Server Components to Client Components**
```tsx
// Before (Server Component)
async function CategoriesTableWrapper({ searchParams }) {
  const data = await getCategories(searchParams);
  return <CategoriesTable data={data} />;
}

// After (Client Component with React Query)
function CategoriesTableWrapper({ searchParams }) {
  const { data, isLoading } = useQuery({
    queryKey: ["categories", searchParams],
    queryFn: () => getCategories(searchParams),
  });

  if (isLoading) return <Skeleton />;
  return <CategoriesTable data={data} />;
}
```

## Complete Working Example

Here's a minimal working example you can copy-paste:

### **1. Install Dependencies**
```bash
npm install @tanstack/react-table @tanstack/react-query nuqs lucide-react sonner
npm install tailwindcss autoprefixer postcss class-variance-authority clsx tailwind-merge
```

### **2. Create Files**
```tsx
// src/hooks/use-search-params.ts
import { createSearchParamsCache, parseAsInteger } from "nuqs";
import { useQueryStates } from "nuqs";

export const searchParamsCache = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
});

export function useSearchParams() {
  const [params] = useQueryStates(searchParamsCache.parsers);
  return params;
}
```

```tsx
// src/components/SimpleTable.tsx
import { useMemo } from "react";
import { useDataTable } from "../hooks/use-data-table";
import { DataTable } from "./data-table/data-table";
import { DataTableToolbar } from "./data-table/data-table-toolbar";

const data = [
  { id: 1, name: "John", email: "john@example.com" },
  { id: 2, name: "Jane", email: "jane@example.com" },
];

const columns = [
  {
    accessorKey: "name",
    header: "Name",
    meta: { enableColumnFilter: true },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
];

export function SimpleTable() {
  const { table } = useDataTable({
    data,
    columns,
    pageCount: 1,
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} />
    </DataTable>
  );
}
```

```tsx
// src/App.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/react";
import { SimpleTable } from "./components/SimpleTable";

const queryClient = new QueryClient();

function App() {
  return (
    <NuqsAdapter>
      <QueryClientProvider client={queryClient}>
        <div className="p-8">
          <h1>My Table App</h1>
          <SimpleTable />
        </div>
      </QueryClientProvider>
    </NuqsAdapter>
  );
}

export default App;
```

## Summary

### **Key Differences: Next.js vs React**
1. **searchParams**: Provided automatically in Next.js, you manage it in React
2. **Data Fetching**: Use React Query instead of promises in server components
3. **Routing**: Use React Router instead of Next.js routing
4. **Suspense**: Handle loading states manually

### **Required Changes for React**
1. Add `useSearchParams()` hook
2. Replace promises with React Query
3. Add loading/error states
4. Handle routing manually
5. Add NuqsAdapter wrapper

### **Dependencies Needed**
- `@tanstack/react-table` - Table functionality
- `@tanstack/react-query` - Data fetching
- `nuqs` - URL state management
- `react-router-dom` - Routing (optional)
- UI libraries (lucide-react, sonner, etc.)

This guide covers everything you need to use the table system in standalone React applications!</content>
<parameter name="filePath">c:\Users\Solzadmin\OneDrive - Soluzione IT Services Private Limited\Desktop\repos\tablecn\REACT_STANDALONE_GUIDE.md