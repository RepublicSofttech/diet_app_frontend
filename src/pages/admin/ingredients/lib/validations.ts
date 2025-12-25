import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsStringEnum,
} from "nuqs/server";
import * as z from "zod";
import { flagConfig } from "@/shared/config/flag";
import { getFiltersStateParser, getSortingStateParser } from "@/shared/lib/parsers";

/* ------------------------------------------------------------------
 * Search Params
 * ------------------------------------------------------------------ */
export const searchParamsCache = createSearchParamsCache({
  filterFlag: parseAsStringEnum(
    flagConfig.featureFlags.map((flag) => flag.value),
  ),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  sort: getSortingStateParser().withDefault([
    { id: "created_at", desc: true },
  ]),
  filters: getFiltersStateParser().withDefault([]),
  joinOperator: parseAsStringEnum(["and", "or"]).withDefault("and"),
});

/* ------------------------------------------------------------------
 * Create Ingredient Schema
 * ------------------------------------------------------------------ */
export const createIngredientSchema = z.object({
  name: z.string().min(1, "Name is required"),

  calories: z.string().min(1, "Calories is required"),
  protein: z.string().min(1, "Protein is required"),
  carbs: z.string().min(1, "Carbs is required"),
  fat: z.string().min(1, "Fat is required"),

  is_vegan: z.boolean(),
  is_non_vegetarian: z.boolean(),

  image_url: z.string().url().nullable().optional(),
});

/* ------------------------------------------------------------------
 * Update Ingredient Schema
 * ------------------------------------------------------------------ */
export const updateIngredientSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),

  calories: z.string().optional(),
  protein: z.string().optional(),
  carbs: z.string().optional(),
  fat: z.string().optional(),

  is_vegan: z.boolean().optional(),
  is_non_vegetarian: z.boolean().optional(),

  image_url: z.string().url().nullable().optional(),
  is_approved: z.boolean().optional(),
});

/* ------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------ */
export type CreateIngredientSchema = z.infer<typeof createIngredientSchema>;
export type UpdateIngredientSchema = z.infer<typeof updateIngredientSchema>;
export type SearchParams = ReturnType<typeof searchParamsCache.parse>;
