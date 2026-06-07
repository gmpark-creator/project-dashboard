import type { ErrorResponse, WorkerLeaseCompletionInput, WorkerLeaseCompletionOutput } from "@/domain/types";
import { isJsonObject } from "./json-body";

type CompletionErrorInput = Partial<Pick<ErrorResponse, "code" | "userMessage" | "retryable" | "fallbackSuggested">>;

const completionKeys = new Set(["token", "status", "error", "outputs", "requireOutputs"]);
const errorKeys = new Set(["code", "userMessage", "retryable", "fallbackSuggested"]);
const outputKeys = new Set([
  "videoUrl",
  "videoStorageKey",
  "posterUrl",
  "posterStorageKey",
  "renderOutputUrl",
  "renderStorageKey",
  "shareUrl",
  "imageVariants"
]);
const imageVariantKeys = new Set(["variantId", "imageUrl", "imageStorageKey", "thumbUrl", "thumbnailStorageKey"]);
const stringOutputKeys = [
  "videoUrl",
  "videoStorageKey",
  "posterUrl",
  "posterStorageKey",
  "renderOutputUrl",
  "renderStorageKey",
  "shareUrl"
];

function hasOnlyKeys(value: Record<string, unknown>, allowed: Set<string>) {
  return Object.keys(value).every((key) => allowed.has(key));
}

function isCompletionError(value: unknown): value is CompletionErrorInput {
  if (!isJsonObject(value) || !hasOnlyKeys(value, errorKeys)) return false;
  if (typeof value.code !== "undefined" && typeof value.code !== "string") return false;
  if (typeof value.userMessage !== "undefined" && typeof value.userMessage !== "string") return false;
  if (typeof value.retryable !== "undefined" && typeof value.retryable !== "boolean") return false;
  return typeof value.fallbackSuggested === "undefined" || typeof value.fallbackSuggested === "boolean";
}

function isImageVariantOutput(
  value: unknown
): value is NonNullable<WorkerLeaseCompletionOutput["imageVariants"]>[number] {
  if (!isJsonObject(value) || !hasOnlyKeys(value, imageVariantKeys)) return false;
  if (typeof value.imageUrl !== "string") return false;
  for (const key of ["variantId", "imageStorageKey", "thumbUrl", "thumbnailStorageKey"]) {
    if (typeof value[key] !== "undefined" && typeof value[key] !== "string") return false;
  }
  return true;
}

function isCompletionOutput(value: unknown): value is WorkerLeaseCompletionOutput {
  if (!isJsonObject(value) || !hasOnlyKeys(value, outputKeys)) return false;
  for (const key of stringOutputKeys) {
    if (typeof value[key] !== "undefined" && typeof value[key] !== "string") return false;
  }
  return (
    typeof value.imageVariants === "undefined" ||
    (Array.isArray(value.imageVariants) && value.imageVariants.every(isImageVariantOutput))
  );
}

export function isWorkerLeaseCompletionInput(value: Record<string, unknown>): value is WorkerLeaseCompletionInput {
  if (!hasOnlyKeys(value, completionKeys)) return false;
  if (typeof value.token !== "string") return false;
  if (value.status !== "succeeded" && value.status !== "failed") return false;
  if (typeof value.requireOutputs !== "undefined" && typeof value.requireOutputs !== "boolean") return false;
  if (typeof value.error !== "undefined" && !isCompletionError(value.error)) return false;
  if (typeof value.outputs !== "undefined" && !isCompletionOutput(value.outputs)) return false;
  return true;
}
