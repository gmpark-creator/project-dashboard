export function isJsonObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function readJsonObject(request: Request): Promise<Record<string, unknown> | null> {
  const body = await request.json().catch(() => ({}));
  return isJsonObject(body) ? body : null;
}
