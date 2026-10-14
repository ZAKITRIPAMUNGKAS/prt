import { DEFAULT_PAGE } from "@/constants";
import {
  createLoader,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
} from "nuqs/server";

export const applicationsSearchParams = {
  search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  status: parseAsArrayOf(parseAsString)
    .withDefault([])
    .withOptions({ clearOnDefault: true }),
  platform: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  page: parseAsInteger
    .withDefault(DEFAULT_PAGE)
    .withOptions({ clearOnDefault: true }),
};

export const loadApplicationsSearchParams = createLoader(
  applicationsSearchParams
);
