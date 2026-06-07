import { apiError } from "./error-response";

export function booleanQueryParam(url: URL, name: string, defaultValue = false) {
  const value = url.searchParams.get(name);
  if (value === null) return { value: defaultValue, error: null };
  if (value === "true") return { value: true, error: null };
  if (value === "false") return { value: false, error: null };
  return { value: defaultValue, error: apiError("BAD_REQUEST", "Invalid query parameter.", 400) };
}
