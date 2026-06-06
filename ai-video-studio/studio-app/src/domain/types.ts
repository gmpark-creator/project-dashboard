export type Intent = "shorts" | "product_ad" | "app_intro" | "real_estate" | "education" | "brand";
export type Tier = "fast" | "economy" | "final";
export type Aspect = "9:16" | "16:9" | "1:1" | "4:5";
export type ProjectStatus = "draft" | "storyboarded" | "generating" | "reviewing" | "edited" | "rendering" | "done" | "failed";
export type ShotStatus = "pending" | "generating" | "reviewing" | "selected" | "failed";
export type JobStatus = "queued" | "running" | "done" | "failed" | "cancelled";
export type AssetKind = "image" | "video" | "audio" | "brand";
export type ImageAssetRole = "product" | "character" | "location" | "style" | "keyframe" | "thumbnail" | "logo" | "background";
export type AssetSource = "image_maker" | "upload" | "external";
export type ImageMakerPurpose = "photoreal" | "product" | "character" | "background" | "style" | "poster" | "thumbnail" | "transparent";
export type AssetUsageMode = "first_frame" | "last_frame" | "style_reference" | "character_reference" | "product_reference" | "background_reference";

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
  defaultRenderJobId: string | null;
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
  referenceImageIds: string[];
  directionSpec: DirectionSpec;
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
  promptPackage: GenerationPromptPackage;
  routing: ProviderRoutingDecision;
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
  rightsReview: RenderRightsReview;
  renderPlan: RenderPlan;
};

export type RenderPreview = {
  projectId: string;
  spec: ExportSpec;
  sourceHash: string;
  rightsReview: RenderRightsReview;
  renderPlan: RenderPlan;
  estimate: {
    credits: number;
    etaSec: number;
  };
};

export type RenderPlan = {
  projectId: string;
  spec: ExportSpec;
  sourceHash: string;
  totalDurationSec: number;
  missingShotIds: string[];
  shots: Array<{
    shotId: string;
    takeId: string;
    order: number;
    title: string;
    durationSec: number;
    videoUrl: string | null;
    posterUrl: string | null;
    tier: Tier;
  }>;
  edit: EditState;
};

export type RenderRightsReview = {
  required: boolean;
  assetIds: string[];
  items: Array<{
    assetId: string;
    label: string;
    role: ImageAssetRole;
    rightsStatus: ImageAsset["rights"]["status"];
    note: string;
    targetShotIds: string[];
  }>;
};

export type DirectionSpec = {
  camera: string;
  composition: string;
  lighting: string;
  motion: string;
  style: string;
  avoid: string[];
  notes: string;
};

export type ImageAsset = {
  id: string;
  projectId: string;
  kind: "image";
  role: ImageAssetRole;
  source: AssetSource;
  label: string;
  prompt: string;
  url: string;
  thumbUrl: string;
  aspect: Aspect;
  width: number;
  height: number;
  rights: {
    status: "user_confirmed" | "generated" | "needs_review";
    note: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type ImageVariant = {
  id: string;
  assetId: string | null;
  label: string;
  status: JobStatus;
  url: string | null;
  thumbUrl: string | null;
  scoreLabel: "추천" | "안정적" | "확인 필요";
};

export type ImageJob = {
  id: string;
  projectId: string;
  status: JobStatus;
  progress: number;
  etaSec: number | null;
  stage: "queued" | "prompting" | "generating" | "saving" | "done" | "failed";
  prompt: string;
  purpose: ImageMakerPurpose;
  role: ImageAssetRole;
  aspect: Aspect;
  style: string;
  count: number;
  variants: ImageVariant[];
  dueAt: number;
  createdAt: string;
  updatedAt: string;
  error: ErrorResponse | null;
};

export type AssetUsage = {
  assetId: string;
  role: ImageAssetRole;
  target: "project" | "shot";
  targetId: string;
  mode: AssetUsageMode;
  createdAt: string;
};

export type AssetDeleteResult = {
  deleted: boolean;
  assetId: string;
  blockedByUsage: boolean;
  usageCount: number;
  remainingAssets: number;
};

export type GenerationReference = {
  assetId: string;
  role: ImageAssetRole;
  mode: AssetUsageMode;
  url: string;
  rightsStatus: ImageAsset["rights"]["status"];
};

export type GenerationPromptPackage = {
  projectId: string;
  shotId: string;
  saec: Saec;
  directionSpec: DirectionSpec;
  requirements: ShotRequirements;
  references: GenerationReference[];
  routingHints: {
    startFrameAssetId: string | null;
    lastFrameAssetId: string | null;
    styleReferenceAssetIds: string[];
    characterReferenceAssetIds: string[];
    productReferenceAssetIds: string[];
    backgroundReferenceAssetIds: string[];
    rightsReviewRequired: boolean;
  };
};

export type ProviderRouteTarget = {
  provider: string;
  model: string;
};

export type ProviderRoutingDecision = {
  ruleId: string;
  selected: ProviderRouteTarget;
  candidates: ProviderRouteTarget[];
  rejected: Array<ProviderRouteTarget & { reason: string }>;
  splitTakeIndex: number;
  fallbackEnabled: boolean;
  hiddenFromUser: boolean;
};

export type ReferenceBoard = {
  projectId: string;
  productImages: string[];
  characterImages: string[];
  locationImages: string[];
  styleImages: string[];
  keyframes: string[];
  thumbnails: string[];
  logos: string[];
  backgrounds: string[];
  usages: AssetUsage[];
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
  imageAssets: ImageAsset[];
  imageJobs: ImageJob[];
  referenceBoards: Record<string, ReferenceBoard>;
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
  imageAssets: ImageAsset[];
  imageJobs: ImageJob[];
  referenceBoard: ReferenceBoard;
  editState: EditState;
  credits: StudioState["credits"];
  renderSourceHash: string;
};
