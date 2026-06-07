import { apiError } from "./error-response";

const notFoundMessages = new Set([
  "Project not found",
  "Shot not found",
  "Shot or image asset not found",
  "Image asset not found",
  "Selectable take not found",
  "Done take not found",
  "Source shot not found",
  "Render job not found"
]);

const conflictMessages = new Set(["Only completed renders can be the default version", "Render job already active"]);

function normalizedMessage(error: unknown) {
  return error instanceof Error ? error.message : "";
}

export function serviceErrorResponse(error: unknown) {
  const message = normalizedMessage(error);
  if (notFoundMessages.has(message)) {
    return apiError("NOT_FOUND", "Resource not found.", 404);
  }
  if (message.includes("already") || conflictMessages.has(message)) {
    return apiError("CONFLICT", "The requested change conflicts with current state.", 409);
  }
  return null;
}
