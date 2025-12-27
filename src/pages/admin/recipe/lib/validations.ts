import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsStringEnum,
} from "nuqs/server";
import * as z from "zod";
import { flagConfig } from "@/shared/config/flag";
import { getFiltersStateParser, getSortingStateParser } from "@/shared/lib/parsers";

export const recipeSearchParamsCache = createSearchParamsCache({
  filterFlag: parseAsStringEnum(
    flagConfig.featureFlags.map((flag) => flag.value),
  ),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  sort: getSortingStateParser(),
  filters: getFiltersStateParser().withDefault([]),
  joinOperator: parseAsStringEnum(["and", "or"]).withDefault("and"),
});


export const createRecipeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  image_url: z.string().url().nullable().optional(),
  diet_type: z.string().min(1, "Diet type is required"),
  category: z.number(),
});

export const updateRecipeSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  description: z.string().optional(),
  image_url: z.string().url().nullable().optional(),
  diet_type: z.string().optional(),
  category: z.number().optional(),
  is_approved: z.boolean().optional(),
});


export type CreateRecipeSchema = z.infer<typeof createRecipeSchema>;
export type UpdateRecipeSchema = z.infer<typeof updateRecipeSchema>;
export type RecipeSearchParams = ReturnType<
  typeof recipeSearchParamsCache.parse
>;
