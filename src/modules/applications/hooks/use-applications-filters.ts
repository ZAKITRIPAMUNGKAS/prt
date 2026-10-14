import { DEFAULT_PAGE } from "@/constants";
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryStates,
} from "nuqs";

export const useApplicationsFilters = () => {
  return useQueryStates({
    search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
    status: parseAsArrayOf(parseAsString)
      .withDefault([])
      .withOptions({ clearOnDefault: true }),
    platform: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
    page: parseAsInteger
      .withDefault(DEFAULT_PAGE)
      .withOptions({ clearOnDefault: true }),
  });
};
