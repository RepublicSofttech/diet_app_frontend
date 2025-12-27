import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsStringEnum,
} from "nuqs/server";
import * as z from "zod";
import { flagConfig } from "@/shared/config/flag";
import { getFiltersStateParser ,getSortingStateParser } from "@/shared/lib/parsers";

export const searchParamsCache = createSearchParamsCache({
  filterFlag: parseAsStringEnum(
    flagConfig.featureFlags.map((flag) => flag.value),
  ),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  sort: getSortingStateParser().withDefault([
    { id: "created_at", desc: true },
  ]),
  // advanced filter
  filters: getFiltersStateParser().withDefault([]),
  joinOperator: parseAsStringEnum(["and", "or"]).withDefault("and"),
});

export const createRoleSchema = z.object({
  name: z.string().min(1, "Name is required"),
  // description: z.string().optional(),
});

export const updateRoleSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  // description: z.string().optional(),
});

export type CreateRoleSchema = z.infer<typeof createRoleSchema>;
export type UpdateRoleSchema = z.infer<typeof updateRoleSchema>;
export type SearchParams = ReturnType<typeof searchParamsCache.parse>;