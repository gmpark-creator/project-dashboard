export const objectStorageProviders = ["mock", "r2"] as const;

export type ObjectStorageProvider = (typeof objectStorageProviders)[number];

export type StoredObjectDeleteResult = {
  provider: ObjectStorageProvider;
  storageKey: string;
  deleted: true;
};

export type StoredObjectIngestInput = {
  sourceUrl: string;
  storageKey: string;
  contentType: "video/mp4" | "image/jpeg" | "image/png" | "audio/mpeg";
  bytes?: number | null;
};

export type StoredObjectIngestResult = {
  provider: ObjectStorageProvider;
  storageKey: string;
  url: string;
  contentType: StoredObjectIngestInput["contentType"];
  bytes: number | null;
  copied: true;
};

export class ObjectStorageUnavailableError extends Error {
  code = "OBJECT_STORAGE_UNAVAILABLE" as const;

  constructor(provider: string, storageKey: string, operation: "delete" | "ingest" = "delete") {
    super(`Object storage ${operation} is not available for provider "${provider}" and key "${storageKey}".`);
    this.name = "ObjectStorageUnavailableError";
  }
}

export function isObjectStorageProvider(value: string): value is ObjectStorageProvider {
  return objectStorageProviders.includes(value as ObjectStorageProvider);
}

export function configuredObjectStorageProvider() {
  const configured = process.env.OBJECT_STORAGE_PROVIDER?.trim();
  if (configured) return configured;
  return process.env.CUTPILOT_RUNTIME_MODE === "production" ? "r2" : "mock";
}

export function deleteStoredObject(storageKey: string): StoredObjectDeleteResult {
  const provider = configuredObjectStorageProvider();
  const production = process.env.CUTPILOT_RUNTIME_MODE === "production";
  if (provider === "mock" && !production) {
    return { provider, storageKey, deleted: true };
  }
  throw new ObjectStorageUnavailableError(provider, storageKey);
}

export function ingestStoredObject(input: StoredObjectIngestInput): StoredObjectIngestResult {
  const provider = configuredObjectStorageProvider();
  const production = process.env.CUTPILOT_RUNTIME_MODE === "production";
  if (provider === "mock" && !production) {
    return {
      provider,
      storageKey: input.storageKey,
      url: input.sourceUrl,
      contentType: input.contentType,
      bytes: input.bytes ?? null,
      copied: true
    };
  }
  throw new ObjectStorageUnavailableError(provider, input.storageKey, "ingest");
}
