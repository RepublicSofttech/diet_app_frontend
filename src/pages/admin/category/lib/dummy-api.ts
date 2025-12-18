import {type SortingState } from "@tanstack/react-table";
import type { Category , CategoryFilters } from "../components/data-table-types";
import { faker } from '@faker-js/faker';

// Create a large dataset for realistic testing
let categories: Category[] = Array.from({ length: 127 }, (_, i) => ({
    id: faker.string.uuid(),
    name: faker.commerce.department(),
    description: faker.commerce.productDescription(),
    isApproved: faker.datatype.boolean(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
}));

// Simulate network delay
const API_DELAY = 750;

/**
 * Simulates fetching categories from a server with pagination, sorting, and filtering.
 */
export const fetchCategories = async ({ pageIndex, pageSize }: { pageIndex: number, pageSize: number }, sorting: SortingState, filters: CategoryFilters) => {
    return new Promise<{ data: Category[], totalCount: number }>(resolve => {
        setTimeout(() => {
            let filteredData = [...categories];

            // 1. Filtering
            if (filters.globalFilter) {
                const searchTerm = filters.globalFilter.toLowerCase();
                filteredData = filteredData.filter(cat => 
                    cat.name.toLowerCase().includes(searchTerm) || 
                    cat.description.toLowerCase().includes(searchTerm)
                );
            }

            if (filters.isApproved && filters.isApproved !== "all") {
                const approvedStatus = filters.isApproved === "true";
                filteredData = filteredData.filter(cat => cat.isApproved === approvedStatus);
            }
            
            // 2. Sorting
            if (sorting.length > 0) {
                const sort = sorting[0];
                filteredData.sort((a, b) => {
                    const valA = a[sort.id as keyof Category];
                    const valB = b[sort.id as keyof Category];
                    if (valA < valB) return sort.desc ? 1 : -1;
                    if (valA > valB) return sort.desc ? -1 : 1;
                    return 0;
                });
            }
            
            const totalCount = filteredData.length;
            
            // 3. Pagination
            const start = pageIndex * pageSize;
            const end = start + pageSize;
            const paginatedData = filteredData.slice(start, end);
            
            resolve({ data: paginatedData, totalCount });
        }, API_DELAY);
    });
};

/**
 * Simulates deleting a category.
 */
export const deleteCategory = async (categoryId: string): Promise<{ success: boolean }> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const initialLength = categories.length;
            categories = categories.filter(c => c.id !== categoryId);
            resolve({ success: categories.length < initialLength });
        }, API_DELAY);
    });
};

// Add/Edit would have similar mock functions...