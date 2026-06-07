import type { AssetUsage, CancelJobResult, CostEstimate, DirectionSpec, EditState, ErrorResponse, ExportSpec, GenerationJob, ImageAsset, ImageAssetRole, ImageJob, ImageMakerPurpose, InsufficientCreditsResponse, Intent, JobQueueSnapshot, MediaArtifactInventory, Project, ProjectBundle, ProviderHealthSnapshot, RenderJob, RenderPreview, RuntimeReadiness, Scene, Shot, StorageCleanupExecutionSnapshot, StorageCleanupPlan, SystemMetrics, Tier, WorkerCompletionSnapshot, WorkerDispatchSnapshot, WorkerLeaseSnapshot, WorkerRetryExecutionSnapshot, WorkerRetryPlan } from "@/domain/types";

type ApiErrorPayload = Partial<ErrorResponse> & {
  estimate?: CostEstimate;
};

export class ApiError extends Error {
  status: number;
  code: string;
  retryable: boolean;
  fallbackSuggested: boolean;
  estimate: CostEstimate | null;
  payload: ApiErrorPayload;

  constructor(status: number, payload: ApiErrorPayload) {
    super(apiErrorMessage(status, payload));
    this.name = "ApiError";
    this.status = status;
    this.code = payload.code || `HTTP_${status}`;
    this.retryable = payload.retryable ?? false;
    this.fallbackSuggested = payload.fallbackSuggested ?? false;
    this.estimate = payload.estimate || null;
    this.payload = payload;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

function isInsufficientCreditsResponse(payload: ApiErrorPayload): payload is InsufficientCreditsResponse {
  return payload.code === "INSUFFICIENT_CREDITS" && Boolean(payload.estimate);
}

function apiErrorMessage(status: number, payload: ApiErrorPayload) {
  const message = payload.userMessage || `Request failed: ${status}`;
  if (!isInsufficientCreditsResponse(payload)) return message;
  const { credits, availableCredits, shortfallCredits } = payload.estimate;
  return `${message} (needed ${credits}, available ${availableCredits}, shortfall ${shortfallCredits})`;
}

async function json<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: { "content-type": "application/json", ...(init?.headers || {}) },
    cache: "no-store"
  });
  if (!response.ok) {
    const error = (await response.json().catch(() => ({}))) as ApiErrorPayload;
    throw new ApiError(response.status, error);
  }
  return (await response.json()) as T;
}

export const studioApi = {
  listProjects: () => json<{ projects: Project[] }>("/api/projects"),
  createProject: (input: { title?: string; idea: string; intent: Intent }) =>
    json<Project>("/api/projects", { method: "POST", body: JSON.stringify(input) }),
  decomposeIdea: (input: { idea: string; intent: Intent; script?: string; attachments?: Array<{ url: string; kind: "image" | "script" | "product_url" | "reference" }> }) =>
    json<{ scenes: Scene[]; shots: Shot[] }>("/api/storyboard/decompose", { method: "POST", body: JSON.stringify(input) }),
  getBundle: (projectId: string) => json<ProjectBundle>(`/api/projects/${projectId}`),
  updateStoryboard: (projectId: string, input: { scenes?: Array<Partial<Scene> & { id?: string }>; shots?: Array<Partial<Shot> & { id?: string }> }) =>
    json<ProjectBundle>(`/api/projects/${projectId}/storyboard`, { method: "PUT", body: JSON.stringify(input) }),
  generateAll: (projectId: string, tier: Tier = "fast") =>
    json<{ jobs: unknown[] }>(`/api/projects/${projectId}/generate-all`, { method: "POST", body: JSON.stringify({ tier }) }),
  generateShot: (shotId: string) =>
    json<{ jobs: unknown[] }>(`/api/shots/${shotId}/generate`, { method: "POST", body: JSON.stringify({ tier: "fast", takeCount: 3 }) }),
  createImageJob: (
    projectId: string,
    input: { prompt: string; purpose: ImageMakerPurpose; role: ImageAssetRole; aspect: Project["aspect"]; style?: string; count?: number }
  ) => json<{ job: ImageJob }>(`/api/projects/${projectId}/image-jobs`, { method: "POST", body: JSON.stringify(input) }),
  registerExternalImage: (
    projectId: string,
    input: { label: string; role: ImageAssetRole; url: string; aspect?: Project["aspect"]; prompt?: string; rightsConfirmed?: boolean }
  ) => json<ImageAsset>(`/api/projects/${projectId}/assets`, { method: "POST", body: JSON.stringify(input) }),
  attachImageToShot: (shotId: string, input: { assetId: string; mode: AssetUsage["mode"] }) =>
    json(`/api/shots/${shotId}/references`, { method: "POST", body: JSON.stringify(input) }),
  updateShotDirection: (shotId: string, patch: Partial<DirectionSpec>) =>
    json(`/api/shots/${shotId}/direction`, { method: "PATCH", body: JSON.stringify(patch) }),
  selectTake: (shotId: string, takeId: string) =>
    json(`/api/shots/${shotId}/select-take`, { method: "POST", body: JSON.stringify({ takeId }) }),
  regenerate: (shotId: string, scope: "shot" | "segment") =>
    json(`/api/shots/${shotId}/regenerate`, { method: "POST", body: JSON.stringify({ scope }) }),
  upgradeTake: (takeId: string) =>
    json(`/api/takes/${takeId}/upgrade`, { method: "POST", body: JSON.stringify({ mode: "final_regenerate" }) }),
  applyEdit: (projectId: string, input: { command?: string }) =>
    json<EditState>(`/api/projects/${projectId}/edits`, { method: "POST", body: JSON.stringify(input) }),
  setAudio: (projectId: string, patch: Partial<EditState>) =>
    json<EditState>(`/api/projects/${projectId}/audio`, { method: "PUT", body: JSON.stringify(patch) }),
  previewRender: (projectId: string, spec: ExportSpec) =>
    json<RenderPreview>(`/api/projects/${projectId}/render-preview`, { method: "POST", body: JSON.stringify({ spec }) }),
  startRender: (projectId: string, specs: ExportSpec[]) =>
    json<{ jobs: unknown[] }>(`/api/projects/${projectId}/renders`, { method: "POST", body: JSON.stringify({ specs }) }),
  setDefaultRender: (projectId: string, renderJobId: string) =>
    json<ProjectBundle>(`/api/projects/${projectId}/default-render`, { method: "POST", body: JSON.stringify({ renderJobId }) }),
  getJob: (jobId: string) => json<GenerationJob | ImageJob | RenderJob>(`/api/jobs/${jobId}`),
  cancelJob: (jobId: string) => json<CancelJobResult>(`/api/jobs/${jobId}/cancel`, { method: "POST", body: "{}" }),
  getReadiness: () => json<RuntimeReadiness>("/api/system/readiness"),
  getSystemMetrics: () => json<SystemMetrics>("/api/system/metrics"),
  getMediaArtifactInventory: () => json<MediaArtifactInventory>("/api/system/media-artifacts"),
  getJobQueueSnapshot: () => json<JobQueueSnapshot>("/api/system/queue"),
  // 운영 콘솔용 읽기 전용 운영자 스냅샷. 모두 admin-guard라 권한이 없으면 실패하므로 호출부에서 조용히
  // 흡수하고 패널만 숨긴다(본 작업 흐름은 막지 않음). 응답에 섞인 raw id·token·provider명·storageKey·url은
  // 화면에 노출하지 않고, 컴포넌트가 집계·안전 라벨만 그린다.
  getProviderHealth: () => json<ProviderHealthSnapshot>("/api/system/provider-health"),
  getWorkerDispatch: () => json<WorkerDispatchSnapshot>("/api/system/worker-dispatch"),
  getWorkerLeases: () => json<WorkerLeaseSnapshot>("/api/system/worker-leases"),
  getWorkerCompletions: () => json<WorkerCompletionSnapshot>("/api/system/worker-completions"),
  getWorkerRetryPlan: () => json<WorkerRetryPlan>("/api/system/worker-retries"),
  getWorkerRetryExecutions: () => json<WorkerRetryExecutionSnapshot>("/api/system/worker-retries/executions"),
  getStorageCleanupPlan: () => json<StorageCleanupPlan>("/api/system/storage-cleanup"),
  getStorageCleanupExecutions: () => json<StorageCleanupExecutionSnapshot>("/api/system/storage-cleanup/executions"),
  tick: () => json<JobQueueSnapshot>("/api/jobs/tick", { method: "POST", body: "{}" })
};
