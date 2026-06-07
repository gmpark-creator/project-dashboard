export function isJsonObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function readJsonObject(request: Request): Promise<Record<string, unknown> | null> {
  const raw = await request.text().catch(() => "");
  if (!raw.trim()) return {};
  try {
    const body = JSON.parse(raw);
    return isJsonObject(body) ? body : null;
  } catch {
    return null;
  }
}
