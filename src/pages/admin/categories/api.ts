// Dummy API functions for categories
// This file contains mock implementations for development and testing

export interface Category {
  id: string;
  name: string;
  description: string | null;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  approved_by: string | null;
}

// Dummy data
let categories: Category[] = [
  {
    id: "1",
    name: "Electronics",
    description: "Electronic devices and gadgets",
    is_approved: true,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
    created_by: "user1",
    approved_by: "admin1",
  },
  {
    id: "2",
    name: "Books",
    description: "Fiction and non-fiction books",
    is_approved: false,
    created_at: "2024-01-16T11:00:00Z",
    updated_at: "2024-01-16T11:00:00Z",
    created_by: "user2",
    approved_by: null,
  },
  {
    id: "3",
    name: "Clothing",
    description: "Men's and women's clothing",
    is_approved: true,
    created_at: "2024-01-17T12:00:00Z",
    updated_at: "2024-01-17T12:00:00Z",
    created_by: "user3",
    approved_by: "admin1",
  },
  {
    id: "4",
    name: "Home & Garden",
    description: "Home improvement and gardening supplies",
    is_approved: false,
    created_at: "2024-01-18T13:00:00Z",
    updated_at: "2024-01-18T13:00:00Z",
    created_by: "user4",
    approved_by: null,
  },
  {
    id: "5",
    name: "Sports",
    description: "Sports equipment and accessories",
    is_approved: true,
    created_at: "2024-01-19T14:00:00Z",
    updated_at: "2024-01-19T14:00:00Z",
    created_by: "user5",
    approved_by: "admin2",
  },
  {
    id: "6",
    name: "Health & Beauty",
    description: "Health, skincare, and beauty products",
    is_approved: true,
    created_at: "2024-01-20T09:00:00Z",
    updated_at: "2024-01-20T09:00:00Z",
    created_by: "user6",
    approved_by: "admin1",
  },
  {
    id: "7",
    name: "Toys",
    description: "Toys and games for kids",
    is_approved: false,
    created_at: "2024-01-21T10:30:00Z",
    updated_at: "2024-01-21T10:30:00Z",
    created_by: "user7",
    approved_by: null,
  },
  {
    id: "8",
    name: "Automotive",
    description: "Car accessories and spare parts",
    is_approved: true,
    created_at: "2024-01-22T11:15:00Z",
    updated_at: "2024-01-22T11:15:00Z",
    created_by: "user8",
    approved_by: "admin2",
  },
  {
    id: "9",
    name: "Groceries",
    description: "Daily essentials and food items",
    is_approved: true,
    created_at: "2024-01-23T12:45:00Z",
    updated_at: "2024-01-23T12:45:00Z",
    created_by: "user9",
    approved_by: "admin1",
  },
  {
    id: "10",
    name: "Furniture",
    description: "Indoor and outdoor furniture",
    is_approved: false,
    created_at: "2024-01-24T13:20:00Z",
    updated_at: "2024-01-24T13:20:00Z",
    created_by: "user10",
    approved_by: null,
  },
  {
    id: "11",
    name: "Office Supplies",
    description: "Stationery and office essentials",
    is_approved: true,
    created_at: "2024-01-25T08:50:00Z",
    updated_at: "2024-01-25T08:50:00Z",
    created_by: "user11",
    approved_by: "admin1",
  },
  {
    id: "12",
    name: "Pet Supplies",
    description: "Food and accessories for pets",
    is_approved: true,
    created_at: "2024-01-26T09:40:00Z",
    updated_at: "2024-01-26T09:40:00Z",
    created_by: "user12",
    approved_by: "admin2",
  },
  {
    id: "13",
    name: "Jewelry",
    description: "Rings, necklaces, and accessories",
    is_approved: false,
    created_at: "2024-01-27T10:10:00Z",
    updated_at: "2024-01-27T10:10:00Z",
    created_by: "user13",
    approved_by: null,
  },
  {
    id: "14",
    name: "Music",
    description: "Musical instruments and accessories",
    is_approved: true,
    created_at: "2024-01-28T11:00:00Z",
    updated_at: "2024-01-28T11:00:00Z",
    created_by: "user14",
    approved_by: "admin1",
  },
  {
    id: "15",
    name: "Movies",
    description: "DVDs, Blu-rays, and digital movies",
    is_approved: true,
    created_at: "2024-01-29T12:00:00Z",
    updated_at: "2024-01-29T12:00:00Z",
    created_by: "user15",
    approved_by: "admin2",
  },
  {
    id: "16",
    name: "Gaming",
    description: "Video games and gaming consoles",
    is_approved: false,
    created_at: "2024-01-30T13:00:00Z",
    updated_at: "2024-01-30T13:00:00Z",
    created_by: "user16",
    approved_by: null,
  },
  {
    id: "17",
    name: "Baby Products",
    description: "Baby care and accessories",
    is_approved: true,
    created_at: "2024-01-31T14:00:00Z",
    updated_at: "2024-01-31T14:00:00Z",
    created_by: "user17",
    approved_by: "admin1",
  },
  {
    id: "18",
    name: "Travel",
    description: "Travel bags and accessories",
    is_approved: true,
    created_at: "2024-02-01T09:30:00Z",
    updated_at: "2024-02-01T09:30:00Z",
    created_by: "user18",
    approved_by: "admin2",
  },
  {
    id: "19",
    name: "Stationery",
    description: "Notebooks, pens, and paper products",
    is_approved: false,
    created_at: "2024-02-02T10:15:00Z",
    updated_at: "2024-02-02T10:15:00Z",
    created_by: "user19",
    approved_by: null,
  },
  {
    id: "20",
    name: "Crafts",
    description: "DIY and craft materials",
    is_approved: true,
    created_at: "2024-02-03T11:45:00Z",
    updated_at: "2024-02-03T11:45:00Z",
    created_by: "user20",
    approved_by: "admin1",
  },
  {
    id: "21",
    name: "Photography",
    description: "Cameras and photography accessories",
    is_approved: true,
    created_at: "2024-02-04T12:30:00Z",
    updated_at: "2024-02-04T12:30:00Z",
    created_by: "user21",
    approved_by: "admin2",
  },
  {
    id: "22",
    name: "Shoes",
    description: "Men's and women's footwear",
    is_approved: false,
    created_at: "2024-02-05T13:15:00Z",
    updated_at: "2024-02-05T13:15:00Z",
    created_by: "user22",
    approved_by: null,
  },
  {
    id: "23",
    name: "Watches",
    description: "Analog and smart watches",
    is_approved: true,
    created_at: "2024-02-06T14:00:00Z",
    updated_at: "2024-02-06T14:00:00Z",
    created_by: "user23",
    approved_by: "admin1",
  },
  {
    id: "24",
    name: "Appliances",
    description: "Home and kitchen appliances",
    is_approved: true,
    created_at: "2024-02-07T15:00:00Z",
    updated_at: "2024-02-07T15:00:00Z",
    created_by: "user24",
    approved_by: "admin2",
  },
  {
    id: "25",
    name: "Art",
    description: "Paintings, sculptures, and art supplies",
    is_approved: false,
    created_at: "2024-02-08T16:00:00Z",
    updated_at: "2024-02-08T16:00:00Z",
    created_by: "user25",
    approved_by: null,
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Apply advanced filters to categories
function applyAdvancedFilters(
  categories: Category[],
  filters: any[]
): Category[] {
  return categories.filter((category) => {
    return filters.every((filter) => {
      const { id, operator, value } = filter;
      const categoryValue = category[id as keyof Category];

      switch (operator) {
        case "iLike":
          return String(categoryValue)
            .toLowerCase()
            .includes(String(value).toLowerCase());
        case "notILike":
          return !String(categoryValue)
            .toLowerCase()
            .includes(String(value).toLowerCase());
        case "eq":
          if (id === "is_approved") {
            return categoryValue === (value === "approved");
          }
          return categoryValue === value;
        case "ne":
          if (id === "is_approved") {
            return categoryValue !== (value === "approved");
          }
          return categoryValue !== value;
        case "isEmpty":
          return (
            categoryValue === null ||
            categoryValue === undefined ||
            categoryValue === ""
          );
        case "isNotEmpty":
          return (
            categoryValue !== null &&
            categoryValue !== undefined &&
            categoryValue !== ""
          );
        case "inArray":
          if (id === "is_approved") {
            return value.includes(categoryValue ? "approved" : "pending");
          }
          return Array.isArray(value) ? value.includes(categoryValue) : false;
        case "notInArray":
          if (id === "is_approved") {
            return !value.includes(categoryValue ? "approved" : "pending");
          }
          return Array.isArray(value) ? !value.includes(categoryValue) : true;
        default:
          return true;
      }
    });
  });
}

// GET /api/v1/categories/
export const getCategories = async (params?: {
  page?: number;
  perPage?: number;
  search?: string;
  filters?: any[];
}) => {
  await delay(500); // Simulate network delay

  const { page = 1, perPage = 10, search, filters } = params || {};

  let filteredCategories = categories;

  if (search) {
    filteredCategories = categories.filter(
      (category) =>
        category.name.toLowerCase().includes(search.toLowerCase()) ||
        (category.description &&
          category.description.toLowerCase().includes(search.toLowerCase()))
    );
  }

  // Apply advanced filters
  if (filters && filters.length > 0) {
    filteredCategories = applyAdvancedFilters(filteredCategories, filters);
  }

  const total = filteredCategories.length;
  const totalPages = Math.ceil(total / perPage);
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  const results = filteredCategories.slice(startIndex, endIndex);

  return {
    results,
    count: total,
    total_pages: totalPages,
    next: page < totalPages ? page + 1 : null,
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
    is_approved: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: "current-user",
    approved_by: null,
  };

  categories.push(newCategory);
  return newCategory;
};

// GET /api/v1/categories/{id}/
export const getCategoryById = async (id: string) => {
  await delay(200);

  const category = categories.find((cat) => cat.id === id);
  if (!category) {
    throw new Error("Category not found");
  }
  return category;
};

// PUT /api/v1/categories/{id}/
export const updateCategory = async (
  id: string,
  data: { name?: string; description?: string }
) => {
  await delay(300);

  const categoryIndex = categories.findIndex((cat) => cat.id === id);
  if (categoryIndex === -1) {
    throw new Error("Category not found");
  }

  categories[categoryIndex] = {
    ...categories[categoryIndex],
    ...data,
    updated_at: new Date().toISOString(),
  };

  return categories[categoryIndex];
};

// PATCH /api/v1/categories/{id}/
export const patchCategory = async (
  id: string,
  data: Partial<{ name: string; description: string }>
) => {
  await delay(300);

  const categoryIndex = categories.findIndex((cat) => cat.id === id);
  if (categoryIndex === -1) {
    throw new Error("Category not found");
  }

  categories[categoryIndex] = {
    ...categories[categoryIndex],
    ...data,
    updated_at: new Date().toISOString(),
  };

  return categories[categoryIndex];
};

// DELETE /api/v1/categories/{id}/
export const deleteCategory = async (id: string) => {
  await delay(300);

  const categoryIndex = categories.findIndex((cat) => cat.id === id);
  if (categoryIndex === -1) {
    throw new Error("Category not found");
  }

  categories.splice(categoryIndex, 1);
  return { success: true };
};

// POST /api/v1/categories/{id}/approve/
export const approveCategory = async (
  id: string,
  data: { is_approved: boolean }
) => {
  await delay(300);

  const categoryIndex = categories.findIndex((cat) => cat.id === id);
  if (categoryIndex === -1) {
    throw new Error("Category not found");
  }

  categories[categoryIndex] = {
    ...categories[categoryIndex],
    is_approved: data.is_approved,
    approved_by: data.is_approved ? "admin-user" : null,
    updated_at: new Date().toISOString(),
  };

  return { is_approved: categories[categoryIndex].is_approved };
};

// Helper function to get approval counts
export const getCategoryApprovalCounts = async () => {
  await delay(200);

  const approved = categories.filter((cat) => cat.is_approved).length;
  const pending = categories.filter((cat) => !cat.is_approved).length;

  return {
    approved,
    pending,
  };
};
