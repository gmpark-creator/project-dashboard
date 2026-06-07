import type { ProviderInvocation } from "../domain/types";

export const providerExecutionContractVersion = "provider_execution_v1";

export type ProviderExecutionErrorCode =
  | "PROVIDER_UNAVAILABLE"
  | "PROVIDER_AUTH_FAILED"
  | "PROVIDER_QUOTA_EXCEEDED"
  | "PROVIDER_REQUEST_INVALID"
  | "PROVIDER_TIMEOUT"
  | "PROVIDER_RESULT_INVALID";

export type ProviderExecutionError = {
  code: ProviderExecutionErrorCode;
  message: string;
  retryable: boolean;
  fallbackSuggested: boolean;
  providerRequestId: string | null;
};

export type ProviderExecutionOutput = {
  sourceUrl: string;
  contentType: "video/mp4" | "image/jpeg";
  bytes: number | null;
  expiresAt: string | null;
};

export type ProviderExecutionResult =
  | {
      contractVersion: typeof providerExecutionContractVersion;
      status: "submitted" | "polling";
      jobId: string;
      takeId: string;
      provider: string;
      model: string;
      providerRequestId: string;
      retryAfterSec: number | null;
    }
  | {
      contractVersion: typeof providerExecutionContractVersion;
      status: "succeeded";
      jobId: string;
      takeId: string;
      provider: string;
      model: string;
      providerRequestId: string;
      video: ProviderExecutionOutput;
      poster: ProviderExecutionOutput | null;
      metadata: Record<string, unknown>;
    }
  | {
      contractVersion: typeof providerExecutionContractVersion;
      status: "failed";
      jobId: string;
      takeId: string;
      provider: string;
      model: string;
      error: ProviderExecutionError;
    };

export function providerExecutionPending(
  invocation: ProviderInvocation,
  input: { status: "submitted" | "polling"; providerRequestId: string; retryAfterSec?: number | null }
): ProviderExecutionResult {
  return {
    contractVersion: providerExecutionContractVersion,
    status: input.status,
    jobId: invocation.jobId,
    takeId: invocation.takeId,
    provider: invocation.provider,
    model: invocation.model,
    providerRequestId: input.providerRequestId,
    retryAfterSec: input.retryAfterSec ?? null
  };
}

export function providerExecutionSucceeded(
  invocation: ProviderInvocation,
  input: {
    providerRequestId: string;
    video: ProviderExecutionOutput;
    poster?: ProviderExecutionOutput | null;
    metadata?: Record<string, unknown>;
  }
): ProviderExecutionResult {
  return {
    contractVersion: providerExecutionContractVersion,
    status: "succeeded",
    jobId: invocation.jobId,
    takeId: invocation.takeId,
    provider: invocation.provider,
    model: invocation.model,
    providerRequestId: input.providerRequestId,
    video: input.video,
    poster: input.poster ?? null,
    metadata: input.metadata ?? {}
  };
}

export function providerExecutionFailed(
  invocation: ProviderInvocation,
  error: ProviderExecutionError
): ProviderExecutionResult {
  return {
    contractVersion: providerExecutionContractVersion,
    status: "failed",
    jobId: invocation.jobId,
    takeId: invocation.takeId,
    provider: invocation.provider,
    model: invocation.model,
    error
  };
}

export function providerExecutionUnavailable(invocation: ProviderInvocation, message = "Live provider execution adapter is unavailable.") {
  return providerExecutionFailed(invocation, {
    code: "PROVIDER_UNAVAILABLE",
    message,
    retryable: false,
    fallbackSuggested: true,
    providerRequestId: null
  });
}

export function validateProviderExecutionResult(invocation: ProviderInvocation, result: ProviderExecutionResult) {
  const errors: string[] = [];
  if (result.contractVersion !== providerExecutionContractVersion) errors.push("contractVersion");
  if (result.jobId !== invocation.jobId) errors.push("jobId");
  if (result.takeId !== invocation.takeId) errors.push("takeId");
  if (result.provider !== invocation.provider) errors.push("provider");
  if (result.model !== invocation.model) errors.push("model");
  if (result.status === "submitted" || result.status === "polling") {
    if (!result.providerRequestId.trim()) errors.push("providerRequestId");
    if (result.retryAfterSec !== null && result.retryAfterSec <= 0) errors.push("retryAfterSec");
  }
  if (result.status === "succeeded") {
    if (!result.providerRequestId.trim()) errors.push("providerRequestId");
    if (result.video.contentType !== "video/mp4") errors.push("video.contentType");
    if (!result.video.sourceUrl.trim()) errors.push("video.sourceUrl");
    if (result.poster && result.poster.contentType !== "image/jpeg") errors.push("poster.contentType");
  }
  if (result.status === "failed") {
    if (!result.error.message.trim()) errors.push("error.message");
  }
  return errors;
}
