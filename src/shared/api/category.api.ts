import { apiClient } from "./httpClient";
// import type { PaginatedCategoriesResponse } from "@/pages/admin/category-tanstack/lib/types/category";
// import type { GetCategoriesSchema } from "@/pages/admin/category-tanstack/lib/validations";

// GET /api/v1/categories/
export const getCategories = async (search: any) => {

  const params = new URLSearchParams({
    page: search.page.toString(),
    per_page: search.perPage.toString(),
    // ordering: search.sort.map(s => `${s.desc ? '-' : ''}${s.id}`).join(','),
    // Add other filters like name, is_approved etc.
  });

  const response =  await apiClient.get<any>(
    `/categories/?${params.toString()}`
  );

  return {
    data: response.data.results,
    pageCount: response.data.total_pages,
  };
};

// POST /api/v1/categories/
export const createCategory = (data:any) => {
  return apiClient.post('/categories', data);
};

// GET /api/v1/categories/{id}/
export const getCategoryById = (id:any) => {
  return apiClient.get(`/categories/${id}/`);
};

// PUT /api/v1/categories/{id}/
export const updateCategory = (id:any, data:any) => {
  return apiClient.put(`/categories/${id}/`, data);
};

// PATCH /api/v1/categories/{id}/
export const patchCategory = (id:any, data:any) => {
  return apiClient.patch(`/categories/${id}/`, data);
};

// DELETE /api/v1/categories/{id}/
export const deleteCategory = (id:any) => {
  return apiClient.delete(`/categories/${id}/`);
};

// POST /api/v1/categories/{id}/approve/
export const approveCategory = (id:any, data:any) => {
  return apiClient.post(`/categories/${id}/approve/`, data);
};








export const DUMMY_CATEGORIES = [
  {
    id: 1,
    name: "Fruits",
    description: "Fresh and seasonal fruits",
    is_approved: true,
    created_at: "2025-01-01T10:00:00Z",
    updated_at: "2025-01-02T10:00:00Z",
    created_by: 1,
    approved_by: 99
  },
  {
    id: 2,
    name: "Vegetables",
    description: "Leafy greens, roots, and farm vegetables",
    is_approved: true,
    created_at: "2025-01-01T11:00:00Z",
    updated_at: "2025-01-02T11:00:00Z",
    created_by: 1,
    approved_by: 99
  },
  {
    id: 3,
    name: "Dairy",
    description: "Milk, cheese, butter, and dairy products",
    is_approved: false,
    created_at: "2025-01-03T09:00:00Z",
    updated_at: "2025-01-03T09:00:00Z",
    created_by: 2,
    approved_by: null
  },
  {
    id: 4,
    name: "Bakery",
    description: "Bread, cakes, pastries, and baked goods",
    is_approved: true,
    created_at: "2025-01-04T09:00:00Z",
    updated_at: "2025-01-04T09:00:00Z",
    created_by: 1,
    approved_by: 99
  },
  {
    id: 5,
    name: "Seafood",
    description: "Fish, shrimp, crab, and seafood items",
    is_approved: true,
    created_at: "2025-01-05T08:30:00Z",
    updated_at: "2025-01-05T08:30:00Z",
    created_by: 3,
    approved_by: 99
  },
  {
    id: 6,
    name: "Meat",
    description: "Fresh and frozen red and white meats",
    is_approved: false,
    created_at: "2025-01-06T07:45:00Z",
    updated_at: "2025-01-06T07:45:00Z",
    created_by: 2,
    approved_by: null
  },
  {
    id: 7,
    name: "Beverages",
    description: "Soft drinks, juices, tea, and coffee",
    is_approved: true,
    created_at: "2025-01-07T12:00:00Z",
    updated_at: "2025-01-07T12:00:00Z",
    created_by: 1,
    approved_by: 99
  },
  {
    id: 8,
    name: "Snacks",
    description: "Chips, cookies, and ready-to-eat snacks",
    is_approved: true,
    created_at: "2025-01-08T14:20:00Z",
    updated_at: "2025-01-08T14:20:00Z",
    created_by: 4,
    approved_by: 99
  },
  {
    id: 9,
    name: "Frozen Foods",
    description: "Frozen meals, vegetables, and desserts",
    is_approved: false,
    created_at: "2025-01-09T16:10:00Z",
    updated_at: "2025-01-09T16:10:00Z",
    created_by: 3,
    approved_by: null
  },
  {
    id: 10,
    name: "Spices & Condiments",
    description: "Herbs, spices, sauces, and seasonings",
    is_approved: true,
    created_at: "2025-01-10T18:00:00Z",
    updated_at: "2025-01-10T18:00:00Z",
    created_by: 1,
    approved_by: 99
  },
  {
    id: 11,
    name: "Organic Foods",
    description: "Certified organic food products",
    is_approved: true,
    created_at: "2025-01-11T09:30:00Z",
    updated_at: "2025-01-11T09:30:00Z",
    created_by: 5,
    approved_by: 99
  },
  {
    id: 12,
    name: "Canned Goods",
    description: "Canned vegetables, beans, and soups",
    is_approved: false,
    created_at: "2025-01-12T10:45:00Z",
    updated_at: "2025-01-12T10:45:00Z",
    created_by: 4,
    approved_by: null
  },
  {
    id: 13,
    name: "Breakfast Items",
    description: "Cereals, oats, spreads, and breakfast foods",
    is_approved: true,
    created_at: "2025-01-13T07:15:00Z",
    updated_at: "2025-01-13T07:15:00Z",
    created_by: 1,
    approved_by: 99
  },
  {
    id: 14,
    name: "Health & Nutrition",
    description: "Protein, supplements, and healthy foods",
    is_approved: false,
    created_at: "2025-01-14T11:40:00Z",
    updated_at: "2025-01-14T11:40:00Z",
    created_by: 5,
    approved_by: null
  },
  {
    id: 15,
    name: "International Foods",
    description: "Imported and world cuisine ingredients",
    is_approved: true,
    created_at: "2025-01-15T13:55:00Z",
    updated_at: "2025-01-15T13:55:00Z",
    created_by: 2,
    approved_by: 99
  }
];

export const getCategoriesDummy = async (searchOptions: {
  page: number;
  perPage: number;
}) => {
  const { page, perPage } = searchOptions;
    console.log("hello getCategoriesDummy")

  const start = (page - 1) * perPage;
  const end = start + perPage;

  const results = DUMMY_CATEGORIES.slice(start, end);
  const pageCount = Math.ceil(DUMMY_CATEGORIES.length / perPage);

  return Promise.resolve({
    data: {
      count: DUMMY_CATEGORIES.length,
      total_pages: pageCount,
      items_per_page: perPage,
      next:
        page < pageCount
          ? `/categories/?page=${page + 1}&per_page=${perPage}`
          : null,
      previous:
        page > 1
          ? `/categories/?page=${page - 1}&per_page=${perPage}`
          : null,
      results
    },
    pageCount
  });
};
