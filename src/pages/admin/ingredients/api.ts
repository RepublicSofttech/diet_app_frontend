// Dummy API functions for ingredients
// This file contains mock implementations for development and testing

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

// Dummy data
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
  {
    id: "2",
    name: "Chicken Breast",
    description: "Boneless chicken breast",
    category: "Meat",
    unit: "kg",
    price: 8.0,
    isActive: true,
    createdAt: "2024-01-16T11:00:00Z",
    updatedAt: "2024-01-16T11:00:00Z",
  },
  {
    id: "3",
    name: "Milk",
    description: "Fresh whole milk",
    category: "Dairy",
    unit: "liter",
    price: 1.2,
    isActive: true,
    createdAt: "2024-01-17T12:00:00Z",
    updatedAt: "2024-01-17T12:00:00Z",
  },
  {
    id: "4",
    name: "Flour",
    description: "All-purpose wheat flour",
    category: "Bakery",
    unit: "kg",
    price: 1.0,
    isActive: false,
    createdAt: "2024-01-18T13:00:00Z",
    updatedAt: "2024-01-18T13:00:00Z",
  },
  {
    id: "5",
    name: "Olive Oil",
    description: "Extra virgin olive oil",
    category: "Oils",
    unit: "liter",
    price: 6.5,
    isActive: true,
    createdAt: "2024-01-19T14:00:00Z",
    updatedAt: "2024-01-19T14:00:00Z",
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// GET /api/v1/ingredients/
export const getIngredients = async (params?: {
  page?: number;
  perPage?: number;
  search?: string;
  filters?: any[];
  sorting?: any[];
}) => {
  await delay(500); // Simulate network delay

  const { page = 1, perPage = 10, search, filters, sorting } = params || {};

  let filteredIngredients = ingredients;

  if (search) {
    filteredIngredients = ingredients.filter(
      (ingredient) =>
        ingredient.name.toLowerCase().includes(search.toLowerCase()) ||
        (ingredient.description &&
          ingredient.description.toLowerCase().includes(search.toLowerCase())) ||
        ingredient.category.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Apply advanced filters
  if (filters && filters.length > 0) {
    filteredIngredients = ingredients.filter((ingredient) => {
      return filters.every((filter) => {
        const { id, operator, value } = filter;
        const ingredientValue = ingredient[id as keyof Ingredient];

        switch (operator) {
          case "iLike":
            return String(ingredientValue)
              .toLowerCase()
              .includes(String(value).toLowerCase());
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

  // Apply sorting
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
  const totalPages = Math.ceil(total / perPage);
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  const results = filteredIngredients.slice(startIndex, endIndex);

  return {
    results,
    count: total,
    total_pages: totalPages,
    next: page < totalPages ? page + 1 : null,
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
export const updateIngredient = async (
  id: string,
  data: Partial<{
    name: string;
    description: string | null;
    category: string;
    unit: string;
    price: number;
    isActive: boolean;
  }>
) => {
  await delay(300);

  const ingredientIndex = ingredients.findIndex((ing) => ing.id === id);
  if (ingredientIndex === -1) {
    throw new Error("Ingredient not found");
  }

  ingredients[ingredientIndex] = {
    ...ingredients[ingredientIndex],
    ...data,
    updatedAt: new Date().toISOString(),
  };

  return ingredients[ingredientIndex];
};

// DELETE /api/v1/ingredients/{id}/
export const deleteIngredient = async (id: string) => {
  await delay(300);

  const ingredientIndex = ingredients.findIndex((ing) => ing.id === id);
  if (ingredientIndex === -1) {
    throw new Error("Ingredient not found");
  }

  ingredients.splice(ingredientIndex, 1);
};