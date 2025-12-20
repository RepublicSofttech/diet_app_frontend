import { z } from "zod";

export const createIngredientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  unit: z.string().min(1, "Unit is required"),
  price: z.number().min(0, "Price must be positive"),
  isActive: z.boolean().optional(),
});

export const updateIngredientSchema = createIngredientSchema.partial();

export type CreateIngredientSchema = z.infer<typeof createIngredientSchema>;
export type UpdateIngredientSchema = z.infer<typeof updateIngredientSchema>;