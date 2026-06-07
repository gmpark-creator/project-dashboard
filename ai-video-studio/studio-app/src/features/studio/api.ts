import type { AssetUsage, CancelJobResult, DirectionSpec, EditState, ExportSpec, ImageAsset, ImageAssetRole, ImageJob, ImageMakerPurpose, Intent, MediaArtifactInventory, Project, ProjectBundle, RenderPreview, RuntimeReadiness, Scene, Shot, SystemMetrics, Tier } from "@/domain/types";

async function json<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: { "content-type": "application/json", ...(init?.headers || {}) },
    cache: "no-store"
  });
  if (!response.ok) {
    const error = (await response.json().catch(() => ({}))) as { userMessage?: string };
    throw new Error(error.userMessage || `Request failed: ${response.status}`);
  }
  return (await response.json()) as T;
}

export const studioApi = {
  listProjects: () => json<{ projects: Project[] }>("/api/projects"),
  createProject: (input: { title?: string; idea: string; intent: Intent }) =>
    json<Project>("/api/projects", { method: "POST", body: JSON.stringify(input) }),
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
  cancelJob: (jobId: string) => json<CancelJobResult>(`/api/jobs/${jobId}/cancel`, { method: "POST", body: "{}" }),
  getReadiness: () => json<RuntimeReadiness>("/api/system/readiness"),
  getSystemMetrics: () => json<SystemMetrics>("/api/system/metrics"),
  getMediaArtifactInventory: () => json<MediaArtifactInventory>("/api/system/media-artifacts"),
  tick: () => json("/api/jobs/tick", { method: "POST", body: "{}" })
};
