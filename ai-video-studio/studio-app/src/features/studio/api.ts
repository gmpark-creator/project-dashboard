import type { EditState, ExportSpec, Intent, Project, ProjectBundle, Tier } from "@/domain/types";

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
  generateAll: (projectId: string, tier: Tier = "fast") =>
    json<{ jobs: unknown[] }>(`/api/projects/${projectId}/generate-all`, { method: "POST", body: JSON.stringify({ tier }) }),
  generateShot: (shotId: string) =>
    json<{ jobs: unknown[] }>(`/api/shots/${shotId}/generate`, { method: "POST", body: JSON.stringify({ tier: "fast", takeCount: 3 }) }),
  selectTake: (shotId: string, takeId: string) =>
    json(`/api/shots/${shotId}/select-take`, { method: "POST", body: JSON.stringify({ takeId }) }),
  regenerate: (shotId: string, scope: "shot" | "segment") =>
    json(`/api/shots/${shotId}/regenerate`, { method: "POST", body: JSON.stringify({ scope }) }),
  upgradeTake: (takeId: string) =>
    json(`/api/takes/${takeId}/upgrade`, { method: "POST", body: JSON.stringify({ mode: "final_regenerate" }) }),
  setAudio: (_projectId: string, _patch: Partial<EditState>) => Promise.resolve(),
  startRender: (projectId: string, specs: ExportSpec[]) =>
    json<{ jobs: unknown[] }>(`/api/projects/${projectId}/renders`, { method: "POST", body: JSON.stringify({ specs }) }),
  tick: () => json("/api/jobs/tick", { method: "POST", body: "{}" })
};
