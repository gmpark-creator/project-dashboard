import { apiError } from "./error-response";

const pathParamPatterns = {
  projectId: /^prj_/,
  shotId: /^sht_/,
  takeId: /^tak_/,
  assetId: /^img_/,
  leaseId: /^wlease_/,
  jobId: /^(gen_|ijob_|rnd_)/
} satisfies Record<string, RegExp>;

export function pathParamsError(params: Record<string, string>) {
  for (const [key, pattern] of Object.entries(pathParamPatterns)) {
    const value = params[key];
    if (typeof value !== "undefined" && !pattern.test(value)) {
      return apiError("BAD_REQUEST", "Invalid path parameter.", 400);
    }
  }
  return null;
}
