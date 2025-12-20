// Dummy API functions for categories
// This file contains mock implementations for development and testing

export interface Category {
  id: string;
  name: string;
  description: string | null;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  approvedBy: string | null;
}

// Dummy data
let categories: Category[] = [
  {
    id: "1",
    name: "Electronics",
    description: "Electronic devices and gadgets",
    isApproved: true,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    createdBy: "user1",
    approvedBy: "admin1",
  },
  {
    id: "2",
    name: "Books",
    description: "Fiction and non-fiction books",
    isApproved: false,
    createdAt: "2024-01-16T11:00:00Z",
    updatedAt: "2024-01-16T11:00:00Z",
    createdBy: "user2",
    approvedBy: null,
  },
  {
    id: "3",
    name: "Clothing",
    description: "Men's and women's clothing",
    isApproved: true,
    createdAt: "2024-01-17T12:00:00Z",
    updatedAt: "2024-01-17T12:00:00Z",
    createdBy: "user3",
    approvedBy: "admin1",
  },
  {
    id: "4",
    name: "Home & Garden",
    description: "Home improvement and gardening supplies",
    isApproved: false,
    createdAt: "2024-01-18T13:00:00Z",
    updatedAt: "2024-01-18T13:00:00Z",
    createdBy: "user4",
    approvedBy: null,
  },
  {
    id: "5",
    name: "Sports",
    description: "Sports equipment and accessories",
    isApproved: true,
    createdAt: "2024-01-19T14:00:00Z",
    updatedAt: "2024-01-19T14:00:00Z",
    createdBy: "user5",
    approvedBy: "admin2",
  },
  {
    id: "6",
    name: "Health & Beauty",
    description: "Health, skincare, and beauty products",
    isApproved: true,
    createdAt: "2024-01-20T09:00:00Z",
    updatedAt: "2024-01-20T09:00:00Z",
    createdBy: "user6",
    approvedBy: "admin1",
  },
  {
    id: "7",
    name: "Toys",
    description: "Toys and games for kids",
    isApproved: false,
    createdAt: "2024-01-21T10:30:00Z",
    updatedAt: "2024-01-21T10:30:00Z",
    createdBy: "user7",
    approvedBy: null,
  },
  {
    id: "8",
    name: "Automotive",
    description: "Car accessories and spare parts",
    isApproved: true,
    createdAt: "2024-01-22T11:15:00Z",
    updatedAt: "2024-01-22T11:15:00Z",
    createdBy: "user8",
    approvedBy: "admin2",
  },
  {
    id: "9",
    name: "Groceries",
    description: "Daily essentials and food items",
    isApproved: true,
    createdAt: "2024-01-23T12:45:00Z",
    updatedAt: "2024-01-23T12:45:00Z",
    createdBy: "user9",
    approvedBy: "admin1",
  },
  {
    id: "10",
    name: "Furniture",
    description: "Indoor and outdoor furniture",
    isApproved: false,
    createdAt: "2024-01-24T13:20:00Z",
    updatedAt: "2024-01-24T13:20:00Z",
    createdBy: "user10",
    approvedBy: null,
  },
  {
    id: "11",
    name: "Office Supplies",
    description: "Stationery and office essentials",
    isApproved: true,
    createdAt: "2024-01-25T08:50:00Z",
    updatedAt: "2024-01-25T08:50:00Z",
    createdBy: "user11",
    approvedBy: "admin1",
  },
  {
    id: "12",
    name: "Pet Supplies",
    description: "Food and accessories for pets",
    isApproved: true,
    createdAt: "2024-01-26T09:40:00Z",
    updatedAt: "2024-01-26T09:40:00Z",
    createdBy: "user12",
    approvedBy: "admin2",
  },
  {
    id: "13",
    name: "Jewelry",
    description: "Rings, necklaces, and accessories",
    isApproved: false,
    createdAt: "2024-01-27T10:10:00Z",
    updatedAt: "2024-01-27T10:10:00Z",
    createdBy: "user13",
    approvedBy: null,
  },
  {
    id: "14",
    name: "Music",
    description: "Musical instruments and accessories",
    isApproved: true,
    createdAt: "2024-01-28T11:00:00Z",
    updatedAt: "2024-01-28T11:00:00Z",
    createdBy: "user14",
    approvedBy: "admin1",
  },
  {
    id: "15",
    name: "Movies",
    description: "DVDs, Blu-rays, and digital movies",
    isApproved: true,
    createdAt: "2024-01-29T12:00:00Z",
    updatedAt: "2024-01-29T12:00:00Z",
    createdBy: "user15",
    approvedBy: "admin2",
  },
  {
    id: "16",
    name: "Gaming",
    description: "Video games and gaming consoles",
    isApproved: false,
    createdAt: "2024-01-30T13:00:00Z",
    updatedAt: "2024-01-30T13:00:00Z",
    createdBy: "user16",
    approvedBy: null,
  },
  {
    id: "17",
    name: "Baby Products",
    description: "Baby care and accessories",
    isApproved: true,
    createdAt: "2024-01-31T14:00:00Z",
    updatedAt: "2024-01-31T14:00:00Z",
    createdBy: "user17",
    approvedBy: "admin1",
  },
  {
    id: "18",
    name: "Travel",
    description: "Travel bags and accessories",
    isApproved: true,
    createdAt: "2024-02-01T09:30:00Z",
    updatedAt: "2024-02-01T09:30:00Z",
    createdBy: "user18",
    approvedBy: "admin2",
  },
  {
    id: "19",
    name: "Stationery",
    description: "Notebooks, pens, and paper products",
    isApproved: false,
    createdAt: "2024-02-02T10:15:00Z",
    updatedAt: "2024-02-02T10:15:00Z",
    createdBy: "user19",
    approvedBy: null,
  },
  {
    id: "20",
    name: "Crafts",
    description: "DIY and craft materials",
    isApproved: true,
    createdAt: "2024-02-03T11:45:00Z",
    updatedAt: "2024-02-03T11:45:00Z",
    createdBy: "user20",
    approvedBy: "admin1",
  },
  {
    id: "21",
    name: "Photography",
    description: "Cameras and photography accessories",
    isApproved: true,
    createdAt: "2024-02-04T12:30:00Z",
    updatedAt: "2024-02-04T12:30:00Z",
    createdBy: "user21",
    approvedBy: "admin2",
  },
  {
    id: "22",
    name: "Shoes",
    description: "Men's and women's footwear",
    isApproved: false,
    createdAt: "2024-02-05T13:15:00Z",
    updatedAt: "2024-02-05T13:15:00Z",
    createdBy: "user22",
    approvedBy: null,
  },
  {
    id: "23",
    name: "Watches",
    description: "Analog and smart watches",
    isApproved: true,
    createdAt: "2024-02-06T14:00:00Z",
    updatedAt: "2024-02-06T14:00:00Z",
    createdBy: "user23",
    approvedBy: "admin1",
  },
  {
    id: "24",
    name: "Appliances",
    description: "Home and kitchen appliances",
    isApproved: true,
    createdAt: "2024-02-07T15:00:00Z",
    updatedAt: "2024-02-07T15:00:00Z",
    createdBy: "user24",
    approvedBy: "admin2",
  },
  {
    id: "25",
    name: "Art",
    description: "Paintings, sculptures, and art supplies",
    isApproved: false,
    createdAt: "2024-02-08T16:00:00Z",
    updatedAt: "2024-02-08T16:00:00Z",
    createdBy: "user25",
    approvedBy: null,
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
          if (id === "isApproved") {
            return categoryValue === (value === "approved");
          }
          return categoryValue === value;
        case "ne":
          if (id === "isApproved") {
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
          if (id === "isApproved") {
            return value.includes(categoryValue ? "approved" : "pending");
          }
          return Array.isArray(value) ? value.includes(categoryValue) : false;
        case "notInArray":
          if (id === "isApproved") {
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
    isApproved: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: "current-user",
    approvedBy: null,
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
    updatedAt: new Date().toISOString(),
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
    updatedAt: new Date().toISOString(),
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
    isApproved: data.is_approved,
    approvedBy: data.is_approved ? "admin-user" : null,
    updatedAt: new Date().toISOString(),
  };

  return { is_approved: categories[categoryIndex].isApproved };
};

// Helper function to get approval counts
export const getCategoryApprovalCounts = async () => {
  await delay(200);

  const approved = categories.filter((cat) => cat.isApproved).length;
  const pending = categories.filter((cat) => !cat.isApproved).length;

  return {
    approved,
    pending,
  };
};
