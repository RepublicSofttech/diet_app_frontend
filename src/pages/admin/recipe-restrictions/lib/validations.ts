import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsStringEnum,
} from "nuqs/server";
import { getFiltersStateParser, getSortingStateParser } from "@/shared/lib/parsers";

/* ------------------------------------------------------------------
 * Search Params
 * ------------------------------------------------------------------ */
export const searchParamsCache = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  sort: getSortingStateParser(),
  filters: getFiltersStateParser().withDefault([]),
  joinOperator: parseAsStringEnum(["and", "or"]).withDefault("and"),
});

export type SearchParams = ReturnType<typeof searchParamsCache.parse>;



import * as z from "zod";

/* ------------------------------------------------------------------
 * Create Mapping Schema
 * ------------------------------------------------------------------ */
export const createHealthRecipeMappingSchema = z.object({
  recipe: z.number().min(1, "Recipe is required"),
  condition: z.number().min(1, "Health condition is required"),
  restriction_type: z.enum(["avoid", "recommended"]),
});

/* ------------------------------------------------------------------
 * Update Mapping Schema
 * ------------------------------------------------------------------ */
export const updateHealthRecipeMappingSchema = z.object({
  restriction_type: z.enum(["avoid", "recommended"]).optional(),
});

export type CreateHealthRecipeMappingSchema = z.infer<
  typeof createHealthRecipeMappingSchema
>;
export type UpdateHealthRecipeMappingSchema = z.infer<
  typeof updateHealthRecipeMappingSchema
>;
