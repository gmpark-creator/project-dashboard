export type Intent = "shorts" | "product_ad" | "app_intro" | "real_estate" | "education" | "brand";
export type Tier = "fast" | "economy" | "final";
export type Aspect = "9:16" | "16:9" | "1:1" | "4:5";
export type ProjectStatus = "draft" | "storyboarded" | "generating" | "reviewing" | "edited" | "rendering" | "done" | "failed";
export type ShotStatus = "pending" | "generating" | "reviewing" | "selected" | "failed";
export type JobStatus = "queued" | "running" | "done" | "failed" | "cancelled";

export type Saec = {
  subject: string;
  action: string;
  environment: string;
  camera: string;
  framing: string;
  lighting: string;
  style: string;
  negative: string;
};

export type ShotRequirements = {
  tier: Tier;
  aspect: Aspect;
  resolution?: "540p" | "720p" | "1080p" | "4k";
  imageToVideo: boolean;
  needsLipsyncAudio: boolean;
  motionHeavy: boolean;
  characterLock: boolean;
  characterId: string | null;
  region: string;
};

export type QualityFlag = {
  axis: "fidelity" | "consistency" | "motion" | "transition" | "audio" | "completeness";
  score: number;
  hint: string;
};

export type Project = {
  id: string;
  title: string;
  idea: string;
  intent: Intent;
  status: ProjectStatus;
  aspect: Aspect;
  targetDurationSec: number;
  progress: { shotsDone: number; shotsTotal: number };
  characters: Array<{ id: string; label: string; refImageUrls: string[] }>;
  thumbUrl: string | null;
  credits: { spent: number; estimateRemaining: number };
  createdAt: string;
  updatedAt: string;
};

export type Scene = {
  id: string;
  projectId: string;
  order: number;
  title: string;
  setting: string;
  timeOfDay: string;
};

export type Shot = {
  id: string;
  projectId: string;
  sceneId: string;
  order: number;
  title: string;
  durationSec: number;
  saec: Saec;
  requirements: ShotRequirements;
  status: ShotStatus;
  selectedTakeId: string | null;
  qualityFlags: QualityFlag[];
};

export type TakeMetrics = Partial<Record<"fidelity" | "consistency" | "motion" | "transition" | "audio" | "completeness" | "overall", number>>;

export type Take = {
  id: string;
  shotId: string;
  projectId: string;
  label: string;
  status: JobStatus;
  videoUrl: string | null;
  posterUrl: string | null;
  durationSec: number;
  tier: Tier;
  engineUsed: string | null;
  metrics: TakeMetrics;
  createdAt: string;
  upgradeSourceTakeId?: string;
  upgradeMode?: "final_regenerate" | "enhance" | "render_upscale";
};

export type GenerationJob = {
  id: string;
  shotId: string;
  takeId: string;
  projectId: string;
  status: JobStatus;
  progress: number;
  etaSec: number | null;
  stage: string;
  shouldFail: boolean;
  dueAt: number;
  createdAt: string;
  updatedAt: string;
  error: ErrorResponse | null;
};

export type ExportSpec = {
  resolution: "720p" | "1080p" | "4k";
  cut: "6s" | "15s" | "30s" | "full";
  aspect: Aspect;
  caption: "none" | "burn-in" | "srt" | "both";
};

export type RenderJob = {
  id: string;
  projectId: string;
  spec: ExportSpec;
  stage: "assemble" | "audio_mix" | "caption_burn" | "encode" | "upscale" | "done";
  progress: number;
  status: JobStatus;
  outputUrl: string | null;
  shareUrl: string | null;
  etaSec: number | null;
  dueAt: number;
  createdAt: string;
  updatedAt: string;
  error: ErrorResponse | null;
};

export type EditState = {
  projectId: string;
  captions: { enabled: boolean; mode: "burn-in" | "srt" | "both"; source: "script-first" | "stt" };
  bgm: { enabled: boolean; track: string; ducking: boolean };
  voiceover: { enabled: boolean; voice: string; source: "licensed_tts" | "user_upload" };
  transitions: "none" | "soft";
  commands: Array<{ command: string; createdAt: string }>;
};

export type ErrorResponse = {
  code: string;
  userMessage: string;
  retryable: boolean;
  fallbackSuggested: boolean;
};

export type StudioState = {
  version: number;
  credits: { balance: number; spent: number; reserved: number };
  projects: Project[];
  scenes: Scene[];
  shots: Shot[];
  takes: Take[];
  generationJobs: GenerationJob[];
  renderJobs: RenderJob[];
  editState: Record<string, EditState>;
  updatedAt: string;
};

export type ProjectBundle = {
  project: Project;
  scenes: Scene[];
  shots: Shot[];
  takes: Take[];
  generationJobs: GenerationJob[];
  renderJobs: RenderJob[];
  editState: EditState;
  credits: StudioState["credits"];
};
