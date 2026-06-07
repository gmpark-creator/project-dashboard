import { createHash, createHmac } from "node:crypto";

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

function sha256Hex(input: string | Buffer) {
  return createHash("sha256").update(input).digest("hex");
}

function hmac(key: string | Buffer, input: string) {
  return createHmac("sha256", key).update(input).digest();
}

function hmacHex(key: string | Buffer, input: string) {
  return createHmac("sha256", key).update(input).digest("hex");
}

function amzTimestamp(date = new Date()) {
  const compact = date.toISOString().replace(/[:-]|\.\d{3}/g, "");
  return {
    dateTime: compact,
    date: compact.slice(0, 8)
  };
}

function r2Env(name: "R2_ACCOUNT_ID" | "R2_ACCESS_KEY_ID" | "R2_SECRET_ACCESS_KEY" | "R2_BUCKET") {
  const value = process.env[name]?.trim();
  if (!value) throw new ObjectStorageUnavailableError("r2", "", "delete");
  return value;
}

function encodeStoragePathPart(value: string) {
  return encodeURIComponent(value).replace(/[!'()*]/g, (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`);
}

function normalizedStorageKey(storageKey: string) {
  const key = storageKey.trim().replace(/^\/+/, "");
  if (!key) throw new ObjectStorageUnavailableError("r2", storageKey, "delete");
  return key;
}

function r2Url(storageKey: string) {
  const accountId = r2Env("R2_ACCOUNT_ID");
  const bucket = r2Env("R2_BUCKET");
  const key = normalizedStorageKey(storageKey)
    .split("/")
    .map(encodeStoragePathPart)
    .join("/");
  return new URL(`https://${accountId}.r2.cloudflarestorage.com/${encodeStoragePathPart(bucket)}/${key}`);
}

function r2SigningKey(secretAccessKey: string, date: string) {
  const kDate = hmac(`AWS4${secretAccessKey}`, date);
  const kRegion = hmac(kDate, "auto");
  const kService = hmac(kRegion, "s3");
  return hmac(kService, "aws4_request");
}

function signedR2Headers(method: "DELETE", url: URL) {
  const accessKeyId = r2Env("R2_ACCESS_KEY_ID");
  const secretAccessKey = r2Env("R2_SECRET_ACCESS_KEY");
  const { date, dateTime } = amzTimestamp();
  const payloadHash = sha256Hex("");
  const canonicalHeaders = `host:${url.host}\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${dateTime}\n`;
  const signedHeaders = "host;x-amz-content-sha256;x-amz-date";
  const canonicalRequest = [method, url.pathname, "", canonicalHeaders, signedHeaders, payloadHash].join("\n");
  const credentialScope = `${date}/auto/s3/aws4_request`;
  const stringToSign = ["AWS4-HMAC-SHA256", dateTime, credentialScope, sha256Hex(canonicalRequest)].join("\n");
  const signature = hmacHex(r2SigningKey(secretAccessKey, date), stringToSign);
  return {
    Authorization: `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`,
    "x-amz-content-sha256": payloadHash,
    "x-amz-date": dateTime
  };
}

async function deleteR2Object(storageKey: string): Promise<StoredObjectDeleteResult> {
  const url = r2Url(storageKey);
  const response = await fetch(url, {
    method: "DELETE",
    headers: signedR2Headers("DELETE", url)
  });
  if (!response.ok) throw new ObjectStorageUnavailableError("r2", storageKey);
  return { provider: "r2", storageKey, deleted: true };
}

export async function deleteStoredObject(storageKey: string): Promise<StoredObjectDeleteResult> {
  const provider = configuredObjectStorageProvider();
  const production = process.env.CUTPILOT_RUNTIME_MODE === "production";
  if (provider === "mock" && !production) {
    return { provider, storageKey, deleted: true };
  }
  if (provider === "r2") return deleteR2Object(storageKey);
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
