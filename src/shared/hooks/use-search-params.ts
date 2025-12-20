import {
  useQueryStates,
  parseAsInteger,
  parseAsStringEnum,
} from "nuqs";
import { getFiltersStateParser, getSortingStateParser } from "../lib/parsers";

export const searchParamParsers = {
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  sort: getSortingStateParser().withDefault([
    { id: "createdAt", desc: true },
  ]),
  filters: getFiltersStateParser().withDefault([]),
  joinOperator: parseAsStringEnum(["and", "or"]).withDefault("and"),
};

export function useSearchParams() {
  const [params] = useQueryStates(searchParamParsers);
  return params;
}
